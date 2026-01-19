import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, Rss, ExternalLink } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  date: string;
  summary: string;
}

const LatestPosts: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Fetching from the specific blog in the screenshot
        // We use the 'summary' feed for lighter data payload
        const res = await fetch('https://seometatagfixer.blogspot.com/feeds/posts/summary?alt=json&max-results=3');
        
        if (!res.ok) throw new Error('Failed to fetch');
        
        const data = await res.json();
        
        if (data.feed && data.feed.entry) {
            const formattedPosts: Post[] = data.feed.entry.map((entry: any) => {
            // Find the alternate link (the actual HTML page)
            const link = entry.link.find((l: any) => l.rel === 'alternate')?.href || '#';
            
            // Attempt to get high-res thumbnail by replacing the default s72-c size
            let thumbnail = 'https://placehold.co/600x315/f1f5f9/64748b?text=No+Image';
            if (entry.media$thumbnail?.url) {
                thumbnail = entry.media$thumbnail.url.replace(/\/s72\-c\//, '/w600-h315-c/');
            }
            
            const date = new Date(entry.published.$t).toLocaleDateString('en-US', {
                month: 'short', day: 'numeric', year: 'numeric'
            });
            
            // Clean up summary (remove HTML tags if any leak through, though summary feed is usually plain text)
            const rawSummary = entry.summary?.$t || '';
            const summary = rawSummary.length > 100 ? rawSummary.substring(0, 100) + '...' : rawSummary;

            return {
                id: entry.id.$t,
                title: entry.title.$t,
                url: link,
                thumbnail,
                date,
                summary
            };
            });
            setPosts(formattedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
      return (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 dark:bg-slate-800 h-64 rounded-xl"></div>
            ))}
        </div>
      );
  }

  if (error || posts.length === 0) return null;

  return (
    <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center justify-between mb-6 px-1">
         <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg">
                <Rss size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">Latest SEO Tips & Updates</h2>
         </div>
         <a href="https://seometatagfixer.blogspot.com/" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
            View Blog <ExternalLink size={14} />
         </a>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map(post => (
           <a 
             key={post.id} 
             href={post.url} 
             target="_blank" 
             rel="noopener noreferrer"
             className="group flex flex-col bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-200 dark:border-slate-700 transition-all duration-300 hover:-translate-y-1"
           >
              <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-slate-900">
                 <img 
                   src={post.thumbnail} 
                   alt={post.title} 
                   className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                   loading="lazy"
                   onError={(e) => {
                       (e.target as HTMLImageElement).src = 'https://placehold.co/600x315/f1f5f9/64748b?text=SEO+Update';
                   }}
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                 <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                    <Calendar size={12} />
                    <span>{post.date}</span>
                 </div>
                 <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {post.title}
                 </h3>
                 <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4 flex-grow leading-relaxed">
                    {post.summary}
                 </p>
                 <div className="flex items-center text-sm font-bold text-brand-600 dark:text-brand-400 mt-auto group-hover:underline decoration-2 underline-offset-2">
                    Read Article <ArrowRight size={16} className="ml-1 transition-transform group-hover:translate-x-1" />
                 </div>
              </div>
           </a>
        ))}
      </div>
    </div>
  );
}

export default LatestPosts;