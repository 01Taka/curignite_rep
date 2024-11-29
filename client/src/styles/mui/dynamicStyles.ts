// styles.ts
export const dynamicStyles = {
  card: (options?: Partial<{ padding: string | number }>) => ({
    padding: options?.padding ?? 1,
    border: 1,
    borderRadius: 2,
  }),
  flexCenter: (options?: Partial<{
    direction: 'row' | 'column'
    justifyContent: 'start' | 'center' | 'end',
    alignItems:  'start' | 'center' | 'end'
  }>) => ({
    display: 'flex',
    flexDirection: options?.direction ?? 'column',
    justifyContent: options?.justifyContent ?? 'center',
    alignItems: options?.alignItems ?? 'center',
  }),
  grid: (options?: Partial<{ gap: number }>) => ({
    display: 'grid',
    gap: options?.gap ?? 1
  })
};
