const mockUseFormStatus = jest.fn()
jest.mock('react-dom', () => {
  const actualModule = jest.requireActual('react-dom')
  return {
    ...actualModule,
    useFormStatus: () => {
      return mockUseFormStatus.mockImplementationOnce(() => {
        return {
          pending: false
        }
      })()
    }
  }
})