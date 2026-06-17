#!/bin/zsh

# Conductor workspace bootstrap.
#
# Symlinks the user's untracked .env files from their origin repo
# ($CONDUCTOR_ROOT_PATH) into this fresh workspace, then installs deps.
# Secrets live in exactly one place (the origin clone); every workspace
# points back at them, so rotating a key updates all workspaces at once.

set -e

# Directories (relative to repo root) that may hold .env* files.
ENV_DIRS=("." "frontend/ui")

for rel in "${ENV_DIRS[@]}"; do
    src_dir="$CONDUCTOR_ROOT_PATH/$rel"
    [ -d "$src_dir" ] || continue
    mkdir -p "$rel"
    for f in "$src_dir"/.env*(.N); do
        # Skip committed templates; they already exist via git.
        [[ "$f" == *.example ]] && continue
        ln -sf "$f" "$rel/"
    done
done

# Install frontend dependencies.
if [ -f "frontend/ui/package.json" ]; then
    (cd frontend/ui && npm install)
fi
