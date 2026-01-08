### Deployment Instructions

To deploy this app on Vercel, you need a Cloud Database.

1.  **Get a Database**:
    *   Sign up for [TiDB Cloud](https://tidbcloud.com/) (Free MySQL) or [Aiven](https://aiven.io/).
    *   Create a Cluster and get your **Connection Info** (Host, User, Password, Port).
    *   Run the SQL from `server/schema.sql` in your cloud database console to create the tables.

2.  **Deploy to Vercel**:
    *   Push this code to GitHub.
    *   Import the repo in Vercel.
    *   **Environment Variables**: Go to Settings > Environment Variables in Vercel and add:
        *   `DB_HOST`: (Your cloud DB host)
        *   `DB_USER`: (Your cloud DB user)
        *   `DB_PASSWORD`: (Your cloud DB password)
        *   `DB_NAME`: (Your cloud DB name)
        *   `JWT_SECRET`: (Any secret string)
        *   `VITE_API_URL`: `https://your-project.vercel.app` (The URL Vercel gives you)

3.  **Done!** Your app will be live.
