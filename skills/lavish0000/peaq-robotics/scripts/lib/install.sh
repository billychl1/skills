#!/usr/bin/env bash

is_official_repo_url() {
  local url="${1:-}"
  case "$url" in
    "https://github.com/peaqnetwork/peaq-robotics-ros2"|\
    "https://github.com/peaqnetwork/peaq-robotics-ros2.git"|\
    "git@github.com:peaqnetwork/peaq-robotics-ros2.git")
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

install_repo() {
  # NOTE: For supply-chain safety, this installer only clones the official peaqnetwork repo.
  local repo="https://github.com/peaqnetwork/peaq-robotics-ros2"
  local target="${HOME}/peaq-robotics-ros2"
  local ref=""
  local update="0"
  local skip_build="0"
  local target_set="0"

  while [[ $# -gt 0 ]]; do
    case "$1" in
      --dir)
        target="${2:-}"
        [[ -n "$target" ]] || fatal "install --dir requires a path"
        target_set="1"
        shift 2
        ;;
      --ref)
        ref="${2:-}"
        [[ -n "$ref" ]] || fatal "install --ref requires a branch/tag/commit"
        shift 2
        ;;
      --update)
        update="1"
        shift
        ;;
      --skip-build)
        skip_build="1"
        shift
        ;;
      *)
        if [[ "$target_set" == "0" ]]; then
          target="$1"
          target_set="1"
        else
          ref="$1"
        fi
        shift
        ;;
    esac
  done

  command -v git >/dev/null 2>&1 || fatal "git not found (required for install)"

  if [[ -d "$target/.git" ]]; then
    local origin
    origin="$(git -C "$target" remote get-url origin 2>/dev/null || true)"
    [[ -n "$origin" ]] || fatal "Existing repo at $target has no origin remote configured"
    is_official_repo_url "$origin" || fatal "Refusing to use non-official origin remote at $target: $origin"

    if [[ "$update" == "1" ]]; then
      git -C "$target" fetch --all --tags
      if [[ -n "$ref" ]]; then
        git -C "$target" checkout "$ref"
      fi
      git -C "$target" pull --ff-only || true
    else
      echo "Repo already exists at $target (use --update to pull)."
    fi
  else
    git clone "$repo" "$target"
    if [[ -n "$ref" ]]; then
      git -C "$target" checkout "$ref"
    fi
  fi

  local config_dir="$target/peaq_ros2_examples/config"
  if [[ -f "$config_dir/peaq_robot.example.yaml" ]] && [[ ! -f "$config_dir/peaq_robot.yaml" ]]; then
    cp "$config_dir/peaq_robot.example.yaml" "$config_dir/peaq_robot.yaml"
    echo "Created $config_dir/peaq_robot.yaml from example (edit as needed)."
  fi
  CONFIG="$config_dir/peaq_robot.yaml"

  if [[ -f "$CONFIG" ]]; then
    set_config_network "$NETWORK_PRIMARY"
    if [[ -n "${PEAQ_ROS2_WALLET_PATH:-}" ]]; then
      set_config_wallet_path "$PEAQ_ROS2_WALLET_PATH"
    else
      set_config_wallet_path "~/.peaq_robot/wallet.json"
    fi
  fi

  if [[ "$skip_build" == "0" ]]; then
    [[ -f "$ROS_SETUP" ]] || fatal "ROS setup not found at $ROS_SETUP (set ROS_SETUP or install ROS 2)"
    command -v colcon >/dev/null 2>&1 || fatal "colcon not found (install colcon or ensure ROS 2 environment is loaded)"

    set +u
    # shellcheck disable=SC1090
    source "$ROS_SETUP"
    set -u

    (cd "$target" && colcon build --symlink-install)
  fi

  local build_note=""
  if [[ "$skip_build" == "1" ]]; then
    build_note="colcon build skipped (run: cd \"$target\" && colcon build --symlink-install)"
  else
    build_note="colcon build completed"
  fi

  cat <<EOF
Install complete.
Next steps:
  export PEAQ_ROS2_ROOT="$target"
  export PEAQ_ROS2_CONFIG_YAML="$target/peaq_ros2_examples/config/peaq_robot.yaml"
  $build_note
EOF
}
