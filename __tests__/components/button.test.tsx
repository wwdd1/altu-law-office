import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../../app/ui/components/core/button'

const mockUseFormStatus = jest.fn().mockReturnValue({
  pending: false
})
jest.mock('react-dom', () => {
  const actualModule = jest.requireActual('react-dom')
  return {
    ...actualModule,
    useFormStatus: () => {
      return mockUseFormStatus()
    }
  }
})

describe('Button', () => {
  it('Renders a button correctly', () => {
    const onClickMock = jest.fn()
    render(
      <Button
        label="Hello"
        disabled={false}
        type="submit"
        onClick={onClickMock}
        className="custom-class-11"
      />
    )
    const button = screen.getByTestId('button')

    mockUseFormStatus.mockImplementationOnce(() => ({
      pending: true,
    }))

    expect(button).toBeInTheDocument()
    expect(button).toHaveTextContent('Hello')
    expect(button).toHaveAttribute('type', 'submit')
    expect(button).toHaveClass('custom-class-11')

    fireEvent.click(button)
    expect(onClickMock).toHaveBeenCalledTimes(1)
  })

  it('Does not accept clicks when disabled', () => {
    const onClickMock = jest.fn()
    render(
      <Button
        label="Hello"
        disabled={true}
        disabledLabel='Disabled'
        onClick={onClickMock}
      />
    )
    const button = screen.getByTestId('button')

    fireEvent.click(button)
    expect(onClickMock).toHaveBeenCalledTimes(0)
    expect(button.innerHTML).toStrictEqual('Disabled')
  })
})