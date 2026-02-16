#!/usr/bin/env bash

resolve_root() {
  if [[ -n "${PEAQ_ROS2_ROOT:-}" ]]; then
    echo "$PEAQ_ROS2_ROOT"
    return
  fi

  for guess in \
    "$HOME/peaq-robotics-ros2" \
    "$HOME/Work/peaq/peaq-robotics-ros2" \
    "/work/peaq-robotics-ros2"; do
    if [[ -d "$guess/peaq_ros2_core" ]]; then
      echo "$guess"
      return
    fi
  done

  echo ""
}

auto_set_ros_domain_id() {
  if [[ -n "${ROS_DOMAIN_ID:-}" && "${ROS_DOMAIN_ID:-}" != "0" ]]; then
    return
  fi
  local workspace
  workspace="$(resolve_openclaw_workspace)"
  if [[ -z "$workspace" ]]; then
    return
  fi
  # Stable-ish per-workspace ROS domain (100-199) to avoid collisions.
  local hash
  hash="$(printf "%s" "$workspace" | cksum | awk '{print $1}')"
  local id=$(( (hash % 100) + 100 ))
  export ROS_DOMAIN_ID="$id"
}

load_root() {
  if [[ -n "$ROOT" ]]; then
    return
  fi

  local found
  found="$(resolve_root)"
  if [[ -z "$found" ]]; then
    return
  fi

  ROOT="$(cd "$found" && pwd)"
  if [[ -n "${PEAQ_ROS2_CONFIG_YAML:-}" ]]; then
    CONFIG="$PEAQ_ROS2_CONFIG_YAML"
  else
    local workspace
    workspace="$(resolve_openclaw_workspace)"
    if [[ -n "$workspace" ]]; then
      local workspace_config="${workspace}/.peaq_robot/peaq_robot.yaml"
      local wallet_path="${workspace}/.peaq_robot/wallet.json"
      mkdir -p "${workspace}/.peaq_robot"
      if [[ ! -f "$workspace_config" ]]; then
        local example="$ROOT/peaq_ros2_examples/config/peaq_robot.example.yaml"
        local base="$ROOT/peaq_ros2_examples/config/peaq_robot.yaml"
        if [[ -f "$example" ]]; then
          cp "$example" "$workspace_config"
        elif [[ -f "$base" ]]; then
          cp "$base" "$workspace_config"
        fi
      fi
      CONFIG="$workspace_config"
      set_config_wallet_path "$wallet_path"
    else
      CONFIG="$ROOT/peaq_ros2_examples/config/peaq_robot.yaml"
    fi
  fi
  WS_SETUP="${WS_SETUP:-$ROOT/install/setup.bash}"
}

require_root() {
  load_root
  if [[ -z "$ROOT" ]]; then
    fatal "PEAQ_ROS2_ROOT not set and repo not found. Run '$SCRIPT_NAME install' or set PEAQ_ROS2_ROOT."
  fi
}

is_world_writable_file() {
  python3 - <<'PY' "$1"
import os
import stat
import sys

path = sys.argv[1]
try:
    mode = os.stat(path).st_mode
except OSError:
    print("1")
    raise SystemExit(0)
print("1" if (mode & stat.S_IWOTH) else "0")
PY
}

validate_setup_script_path() {
  local path="$1"
  local label="$2"
  local real_path

  [[ -n "$path" ]] || fatal "$label is not set"
  real_path="$(resolve_realpath "$path")"
  [[ -f "$real_path" ]] || fatal "$label not found at $path"
  [[ "$(is_world_writable_file "$real_path")" == "0" ]] || fatal "$label points to world-writable file: $real_path"
  echo "$real_path"
}

setup_path_is_trusted() {
  local real_path="$1"
  local root
  local -a roots=()
  local trusted_csv="${PEAQ_ROS2_TRUSTED_SETUP_ROOTS:-}"

  roots+=("/opt/ros")
  if [[ -n "$ROOT" ]]; then
    roots+=("$ROOT/install")
  fi
  if [[ -n "${PEAQ_ROS2_ROOT:-}" ]]; then
    roots+=("$PEAQ_ROS2_ROOT/install")
  fi

  if [[ -n "$trusted_csv" ]]; then
    local IFS=','
    read -r -a extra_roots <<<"$trusted_csv"
    for root in "${extra_roots[@]}"; do
      root="$(echo "$root" | xargs)"
      [[ -n "$root" ]] && roots+=("$root")
    done
  fi

  for root in "${roots[@]}"; do
    [[ -e "$root" ]] || continue
    local root_real
    root_real="$(resolve_realpath "$root")"
    if path_is_within "$real_path" "$root_real"; then
      return 0
    fi
  done
  return 1
}

ensure_env() {
  require_root
  local default_ros_setup="/opt/ros/humble/setup.bash"
  local default_ws_setup="$ROOT/install/setup.bash"
  local ros_setup_candidate="$ROS_SETUP"
  local ws_setup_candidate="$WS_SETUP"
  local ros_setup_path ws_setup_path

  if [[ -f "$default_ros_setup" ]]; then
    ros_setup_candidate="$default_ros_setup"
  fi
  if [[ -f "$default_ws_setup" ]]; then
    ws_setup_candidate="$default_ws_setup"
  fi

  ros_setup_path="$(validate_setup_script_path "$ros_setup_candidate" "ROS_SETUP")"
  ws_setup_path="$(validate_setup_script_path "$ws_setup_candidate" "WS_SETUP")"

  if [[ "${PEAQ_ROS2_TRUST_SETUP_OVERRIDES:-0}" != "1" ]]; then
    setup_path_is_trusted "$ros_setup_path" || fatal "ROS_SETUP path is outside trusted roots. Set PEAQ_ROS2_TRUSTED_SETUP_ROOTS or PEAQ_ROS2_TRUST_SETUP_OVERRIDES=1."
    setup_path_is_trusted "$ws_setup_path" || fatal "WS_SETUP path is outside trusted roots. Set PEAQ_ROS2_TRUSTED_SETUP_ROOTS or PEAQ_ROS2_TRUST_SETUP_OVERRIDES=1."
  fi

  [[ -f "$CONFIG" ]] || fatal "Config file not found at $CONFIG"

  # ROS setup scripts assume some vars may be unset; avoid nounset errors.
  set +u
  # shellcheck disable=SC1090
  source "$ros_setup_path"
  # shellcheck disable=SC1090
  source "$ws_setup_path"
  set -u
}
