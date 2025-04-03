import React, { useEffect, useState } from 'react';
import { Users, Eye, Github } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface Contributor {
  name: string;
  role: string;
  github: string;
}

interface PageViews {
  view_count: number;
  last_viewed: string;
}

const Stats: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);
  const [pageViews, setPageViews] = useState<PageViews | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch contributors
        const { data: contributorsData } = await supabase
          .from('contributors')
          .select('*')
          .order('created_at', { ascending: true });

        // Fetch and update page views
        const { data: viewsData } = await supabase
          .from('page_views')
          .select('*')
          .single();

        if (contributorsData) setContributors(contributorsData);
        if (viewsData) setPageViews(viewsData);

        // Increment view count
        if (viewsData) {
          await supabase
            .from('page_views')
            .update({ 
              view_count: viewsData.view_count + 1,
              last_viewed: new Date().toISOString()
            })
            .eq('id', viewsData.id);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 space-y-8">
      {/* Page Views Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center space-x-4 mb-4">
          <Eye className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-semibold text-gray-800">Page Statistics</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600">Total Views</p>
            <p className="text-3xl font-bold text-blue-700">{pageViews?.view_count || 0}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-600">Last Viewed</p>
            <p className="text-sm font-medium text-purple-700">
              {pageViews?.last_viewed 
                ? new Date(pageViews.last_viewed).toLocaleString()
                : 'Never'}
            </p>
          </div>
        </div>
      </div>

      {/* Contributors Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="flex items-center space-x-4 mb-6">
          <Users className="w-6 h-6 text-purple-500" />
          <h2 className="text-2xl font-semibold text-gray-800">Contributors</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contributors.map((contributor) => (
            <div
              key={contributor.name}
              className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 transform hover:scale-105 transition-transform duration-200"
            >
              <h3 className="text-lg font-semibold text-purple-800">{contributor.name}</h3>
              <p className="text-sm text-purple-600 mb-2">{contributor.role}</p>
              {contributor.github !== 'N/A' && (
                <a
                  href={`https://github.com/${contributor.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-pink-600 hover:text-pink-700"
                >
                  <Github className="w-4 h-4" />
                  <span>@{contributor.github}</span>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;