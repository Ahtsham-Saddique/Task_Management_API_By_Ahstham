### MongoDB connection issue notes

Your current `MONGODB_URI` includes `@cluster...` plus a `...@1234@cluster0...` sequence. That makes the SRV lookup invalid and causes `querySrv ENOTFOUND _mongodb._tcp.1234`.

For `mongodb+srv://...` URIs, remove the `:port` / `@1234@` portion. The host should look like:

`mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<db>?<options>`

Example (structure only):
`mongodb+srv://ahtshamsaddique55_db_user:Raja@cluster0.lqso3nv.mongodb.net/Task_Mng_API`

Use the exact credentials/URI from your MongoDB Atlas “Connect” dialog for best results.

