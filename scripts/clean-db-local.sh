#!/bin/bash

# Script to clean the local D1 database
# This will delete all data from the database

set -e

echo "🧹 Cleaning local D1 database..."
echo ""
echo "⚠️  WARNING: This will delete ALL data from your local database!"
echo "   - All analyses"
echo "   - All tasks"
echo "   - All user profiles"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "❌ Aborted"
  exit 0
fi

echo ""
echo "🗑️  Deleting all data..."

# Delete all tasks first (due to foreign key constraints)
npx wrangler d1 execute web-friend-db --local --command "DELETE FROM tasks;"
echo "✅ Deleted all tasks"

# Delete all analyses
npx wrangler d1 execute web-friend-db --local --command "DELETE FROM analyses;"
echo "✅ Deleted all analyses"

# Delete all user profiles
npx wrangler d1 execute web-friend-db --local --command "DELETE FROM user_profiles;"
echo "✅ Deleted all user profiles"

echo ""
echo "✨ Local database cleaned successfully!"
echo ""
echo "📊 Verifying cleanup..."
npx wrangler d1 execute web-friend-db --local --command "SELECT COUNT(*) as task_count FROM tasks;"
npx wrangler d1 execute web-friend-db --local --command "SELECT COUNT(*) as analysis_count FROM analyses;"
npx wrangler d1 execute web-friend-db --local --command "SELECT COUNT(*) as user_count FROM user_profiles;"

