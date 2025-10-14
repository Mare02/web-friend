#!/bin/bash

# Script to clean the production D1 database
# This will delete all data from the production database

set -e

echo "🧹 Cleaning PRODUCTION D1 database..."
echo ""
echo "⚠️  ⚠️  ⚠️  DANGER WARNING ⚠️  ⚠️  ⚠️"
echo ""
echo "This will delete ALL data from your PRODUCTION database!"
echo "   - All analyses"
echo "   - All tasks"
echo "   - All user profiles"
echo ""
echo "This action CANNOT be undone!"
echo ""
read -p "Type 'DELETE PRODUCTION DATA' to confirm: " confirm

if [ "$confirm" != "DELETE PRODUCTION DATA" ]; then
  echo "❌ Aborted"
  exit 0
fi

echo ""
read -p "Are you ABSOLUTELY sure? Type 'yes' to proceed: " final_confirm

if [ "$final_confirm" != "yes" ]; then
  echo "❌ Aborted"
  exit 0
fi

echo ""
echo "🗑️  Deleting all production data..."

# Delete all tasks first (due to foreign key constraints)
npx wrangler d1 execute web-friend-db --remote --command "DELETE FROM tasks;"
echo "✅ Deleted all tasks"

# Delete all analyses
npx wrangler d1 execute web-friend-db --remote --command "DELETE FROM analyses;"
echo "✅ Deleted all analyses"

# Delete all user profiles
npx wrangler d1 execute web-friend-db --remote --command "DELETE FROM user_profiles;"
echo "✅ Deleted all user profiles"

echo ""
echo "✨ Production database cleaned successfully!"
echo ""
echo "📊 Verifying cleanup..."
npx wrangler d1 execute web-friend-db --remote --command "SELECT COUNT(*) as task_count FROM tasks;"
npx wrangler d1 execute web-friend-db --remote --command "SELECT COUNT(*) as analysis_count FROM analyses;"
npx wrangler d1 execute web-friend-db --remote --command "SELECT COUNT(*) as user_count FROM user_profiles;"

