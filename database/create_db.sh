#!/bin/bash
psql -U $(whoami) -d postgres -f 1_create_roles_and_db.sql

# Check if database exists
if ! psql -U $(whoami) -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='poster_judging'" | grep -q 1; then
    createdb -U $(whoami) -O admin poster_judging
    echo "Database 'poster_judging' created."
else
    echo "Database 'poster_judging' already exists."
fi

psql -U $(whoami) -d postgres -c "GRANT CONNECT ON DATABASE poster_judging TO app_user;"

psql -U $(whoami) -d poster_judging -f 2_grant_permissions.sql
psql -U $(whoami) -d poster_judging -f 3_create_tables.sql

