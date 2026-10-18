const paths=["","/products","/quality","/about","/contact","/privacy","/terms"];
export default function sitemap(){const base=(process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000").replace(/\/$/,"");return paths.map(path=>({url:`${base}${path}`,lastModified:new Date(),changeFrequency:path===""?"daily":"monthly",priority:path===""?1:path==="/products" ? 0.9 : 0.6}));}
