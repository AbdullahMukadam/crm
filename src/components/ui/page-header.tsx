// Title + subtitle on the left, actions on the right, optional tab/filter row below, divider under all of it
export function PageHeader({
    title,
    description,
    actions,
    children,
}: {
    title: string;
    description?: React.ReactNode;
    actions?: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <div className="border-b border-border">
            <div className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0 space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
            </div>
            {children && (
                <div className="-mb-px flex flex-col gap-3 pb-3 sm:flex-row sm:items-center sm:justify-between">
                    {children}
                </div>
            )}
        </div>
    );
}
