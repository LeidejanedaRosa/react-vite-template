import { type ReactElement } from 'react'

import { cleanup, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

function customRender(
  ui: ReactElement,
  options: Record<string, unknown> = {}
): ReturnType<typeof render> {
  return render(ui, {
    wrapper: ({ children }) => children,
    ...options,
  })
}

export * from '@testing-library/react'
export { customRender as render, userEvent }
