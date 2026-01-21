'use client';

import React from 'react';
import { usePyramidStore } from '@/lib/store';
import { exportsApi } from '@/lib/api-client';
import { downloadBlob } from '@/lib/utils';
import { Save, Download, AlertCircle, CheckCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export const UnsavedChangesIndicator: React.FC = () => {
  const { unsavedChanges, lastSavedAt, sessionId, pyramid, resetUnsavedChanges } = usePyramidStore();
  const [isDownloading, setIsDownloading] = React.useState(false);

  const handleQuickDownload = async () => {
    if (!pyramid) return;

    try {
      setIsDownloading(true);
      const blob = await exportsApi.exportJSON(sessionId, {
        audience: 'detailed',
        include_metadata: true,
        include_cover_page: true,
        include_distribution: true,
      });
      const filename = `${pyramid.metadata.project_name}_backup_${new Date().toISOString().split('T')[0]}.json`;
      downloadBlob(blob, filename);
      resetUnsavedChanges();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  // Don't render if there's no pyramid loaded
  if (!pyramid) {
    return null;
  }

  const hasUnsavedChanges = unsavedChanges > 0;

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`rounded-lg shadow-lg border-2 transition-all ${
          hasUnsavedChanges
            ? 'bg-amber-50 border-amber-300 dark:bg-amber-900/20 dark:border-amber-700'
            : 'bg-green-50 border-green-300 dark:bg-green-900/20 dark:border-green-700'
        }`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              {hasUnsavedChanges ? (
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              )}
            </div>

            {/* Status Text */}
            <div className="flex-1 min-w-0">
              {hasUnsavedChanges ? (
                <div>
                  <div className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                    {unsavedChanges} unsaved {unsavedChanges === 1 ? 'change' : 'changes'}
                  </div>
                  <div className="text-xs text-amber-700 dark:text-amber-300">
                    Download backup to save your work
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-sm font-semibold text-green-900 dark:text-green-100">
                    All changes saved
                  </div>
                  {lastSavedAt && (
                    <div className="text-xs text-green-700 dark:text-green-300">
                      {formatDistanceToNow(lastSavedAt, { addSuffix: true })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Download Button */}
            {hasUnsavedChanges && (
              <button
                onClick={handleQuickDownload}
                disabled={isDownloading}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Download JSON backup"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? 'Saving...' : 'Save'}
              </button>
            )}

            {/* Always show download option when saved */}
            {!hasUnsavedChanges && (
              <button
                onClick={handleQuickDownload}
                disabled={isDownloading}
                className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Download JSON backup"
                title="Download current version"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
