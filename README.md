# RDD-web

Web App for Rock Displacement Dashboard.

Uses Managed Identity from Azure to locate secrets.

In `.env.local` be sure to set `KeyVault_Name` to the current unique key vault name. You should
also be added to the Developers group in Azure, and have done `az login` to use Default Credentials to get access to the key vault.

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Technologies used and references

- [Next.js Documentation](https://nextjs.org/docs)
- [ElasticSearch Searching](https://www.elastic.co/guide/en/elasticsearch/reference/8.14/search-search.html)
- [ElasticSearch JS Client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html)
- [Tailwind](https://tailwindcss.com/docs/border-radius)
- [shadcn/ui](https://ui.shadcn.com/)
