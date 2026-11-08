# TRACE LAB — ORBIT LAB

Static UI: `lab/trace-lab/index.html`
Cloudflare Worker source: `lab/trace-lab/worker.js`
D1 schema: `lab/trace-lab/schema.sql`

## Deploy
1. Create a Cloudflare Worker and deploy `worker.js`.
2. Bind a Cloudflare D1 database as `DB`.
3. Set Worker secret `ADMIN_KEY`.
4. Run `schema.sql` on the D1 database. For an existing database, apply the migration SQL files in order.
5. Open the TRACE LAB page, enter the deployed Worker URL and ADMIN_KEY to create links.

The visitor page tells visitors that IP address, IP-estimated region and access time are recorded. GPS is optional and only submitted after the visitor presses the GPS button and grants the browser permission. Never use the tool for covert tracking or harassment.

Records are automatically cleaned after 7 days; unused links after 30 days.
