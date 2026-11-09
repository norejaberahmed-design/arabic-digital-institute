# SQLite preview database

The preview uses SQLite at `file:/tmp/adi.db` and initializes the schema and idempotent sample curriculum at process startup:

```sh
pnpm db:push
pnpm db:seed
pnpm --filter @adi/web start
```

**Important:** the free Render service has an ephemeral filesystem. The database is suitable only for a disposable preview; accounts and learning progress can be lost on restart or redeploy. Do not use this deployment for real learners or collect sensitive information. Before public production use, attach persistent storage (if supported by the selected plan) or move to a managed persistent database and verify backup/restore.

The former PostgreSQL database is not deleted or modified by this preview configuration.
