interface CenteredLoadingProps {
  label?: string
  minHeightClassName?: string
}

export function CenteredLoading({
  label = 'Chargement...',
  minHeightClassName = 'min-h-[260px]',
}: CenteredLoadingProps) {
  return (
    <div className={`flex w-full items-center justify-center ${minHeightClassName}`}>
      <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600 shadow-sm">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
        {label}
      </div>
    </div>
  )
}
