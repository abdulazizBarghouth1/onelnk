import { useState, useEffect } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { PageTemplate } from '@/components/page-template';
import { Button } from '@/components/ui/button';
import { Pagination } from '@/components/ui/pagination';
import { SearchAndFilterBar } from '@/components/ui/search-and-filter-bar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Eye, Edit, Trash2 } from 'lucide-react';
import { CrudDeleteModal } from '@/components/CrudDeleteModal';
import { toast } from '@/components/custom-toast';

export default function Index() {
    const { t } = useTranslation();
    const { pages, filters: pageFilters = {} } = usePage().props as any;
    const flash = (usePage().props as any)?.flash;
    const [searchTerm, setSearchTerm] = useState(pageFilters.search || '');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState<any>(null);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
    }, [flash?.success]);

    const breadcrumbs = [
        { title: t('Dashboard'), href: route('dashboard') },
        { title: t('Business Directory') },
        { title: t('Custom Pages') },
    ];

    const pageActions = [{
        label: t('Create Page'),
        icon: <Plus className="h-4 w-4 mr-2" />,
        variant: 'default',
        onClick: () => router.visit(route('directory.custom-pages.create')),
    }];

    const applyFilters = () => {
        const params: any = { page: 1 };
        if (searchTerm) params.search = searchTerm;
        if (pageFilters.per_page) params.per_page = pageFilters.per_page;
        router.get(route('directory.custom-pages.index'), params, { preserveState: true, preserveScroll: true });
    };

    const handleDeleteConfirm = () => {
        toast.loading(t('Deleting page...'));
        router.delete(route('directory.custom-pages.destroy', currentPage.id), {
            onSuccess: (page) => {
                setIsDeleteModalOpen(false);
                toast.dismiss();
                if ((page.props as any)?.flash?.success) toast.success((page.props as any).flash.success);
            },
            onError: () => {
                toast.dismiss();
                toast.error(t('Failed to delete page'));
            },
        });
    };

    return (
        <PageTemplate title={t('Custom Pages')} url="/directory/custom-pages" actions={pageActions} breadcrumbs={breadcrumbs} noPadding>
            <Head title={t('Custom Pages')} />

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow mb-4 p-4">
                <SearchAndFilterBar
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    onSearch={(e) => { e.preventDefault(); applyFilters(); }}
                    filters={[]}
                    showFilters={false}
                    setShowFilters={() => { }}
                    hasActiveFilters={() => !!searchTerm}
                    activeFilterCount={() => (searchTerm ? 1 : 0)}
                    onResetFilters={() => { setSearchTerm(''); router.get(route('directory.custom-pages.index'), { page: 1 }, { preserveState: true, preserveScroll: true }); }}
                    onApplyFilters={applyFilters}
                    currentPerPage={pageFilters.per_page?.toString() || '10'}
                    onPerPageChange={(value) => {
                        const params: any = { page: 1, per_page: parseInt(value) };
                        if (searchTerm) params.search = searchTerm;
                        router.get(route('directory.custom-pages.index'), params, { preserveState: true, preserveScroll: true });
                    }}
                />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Title')}</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Slug')}</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Status')}</th>
                                <th className="px-4 py-3 text-left font-medium text-gray-500">{t('Updated At')}</th>
                                <th className="px-4 py-3 text-right font-medium text-gray-500">{t('Actions')}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pages?.data?.map((page: any) => (
                                <tr key={page.id} className="border-b hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                                    <td className="px-4 py-3 font-medium">{page.title}</td>
                                    <td className="px-4 py-3">/directory-page/{page.slug}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${page.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {page.is_active ? t('Active') : t('Inactive')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {window.appSettings?.formatDateTime ? window.appSettings.formatDateTime(page.updated_at, false) : new Date(page.updated_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex justify-end gap-1">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => window.open(route('directory.custom-page.show', page.slug), '_blank')}
                                                        className="text-green-500 hover:text-green-700"
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>{t('View')}</TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => router.visit(route('directory.custom-pages.edit', page.id))}
                                                        className="text-blue-500 hover:text-blue-700"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>{t('Edit')}</TooltipContent>
                                            </Tooltip>
                                            {!page.is_disable && (
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => { setCurrentPage(page); setIsDeleteModalOpen(true); }}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>{t('Delete')}</TooltipContent>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(!pages?.data || pages.data.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        {t('No custom pages found')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {pages?.links && (
                    <Pagination
                        from={pages?.from || 0}
                        to={pages?.to || 0}
                        total={pages?.total || 0}
                        links={pages?.links}
                        entityName={t('pages')}
                        onPageChange={(url) => router.get(url)}
                    />
                )}
            </div>

            <CrudDeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                itemName={currentPage?.title || ''}
                entityName="page"
            />
        </PageTemplate>
    );
}
