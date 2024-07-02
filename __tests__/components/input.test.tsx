import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Input from '../../app/ui/components/core/input'

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

describe('Input', () => {
  it('Renders with minimum props', () => {
    render(
      <Input
        type="text"
        name="test-input"
      />
    )

    const input = screen.getByTestId('input') as HTMLInputElement

    expect(input).toHaveAttribute('name', 'test-input')
    expect(input).toHaveAttribute('type', 'text')
    expect(input).not.toHaveAttribute('disabled')

    fireEvent.change(input, { target: { value: 'Hellow :)' } })
    expect(input.value).toStrictEqual('Hellow :)')
  })

  it('Attribute values are reflecting correctly', () => {
    render(
      <Input
        type="email"
        name="email-input"
        value="email@email.co"
        disabled={false}
        placeholder="email-input-placeholder"
        maxLength={30}
      />
    )

    const input = screen.getByTestId('input') as HTMLInputElement

    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveAttribute('name', 'email-input')
    expect(input.value).toStrictEqual('email@email.co')
    expect(input).not.toHaveAttribute('disabled')
    expect(input).toHaveAttribute('maxLength', '30')

    fireEvent.change(input, { target: { value: 'hello@world.co' } })

    expect(input.value).toStrictEqual('hello@world.co')
  })

  it('Disabled state works with form status and disabled prop', () => {
    const { rerender } = render(
      <Input
        type="text"
        name="test-input"
      />
    )
    const input = screen.getByTestId('input') as HTMLInputElement

    expect(input).not.toHaveAttribute('disabled')

    mockUseFormStatus.mockReturnValueOnce({
      pending: false
    })
    rerender(
      <Input
        type="text"
        name="test-input"
        disabled={true}
      />
    )
    expect(input).toHaveAttribute('disabled')

    mockUseFormStatus.mockReturnValueOnce({
      pending: true
    })
    rerender(
      <Input
        type="text"
        name="test-input"
        disabled={false}
      />
    )
    expect(input).toHaveAttribute('disabled')
  })

  it('Renders with initial value prop when changed', () => {
    const { rerender } = render(
      <Input
        type="text"
        name="test-input"
        value="initial hello"
      />
    )
    const input = screen.getByTestId('input') as HTMLInputElement

    expect(input.value).toStrictEqual('initial hello')

    fireEvent.change(input, { target: { value: 'changed value' } })
    expect(input.value).toStrictEqual('changed value')

    rerender(
      <Input
        type="text"
        name="test-input"
        value="changed initial hello"
      />
    )
    expect(input.value).toStrictEqual('changed initial hello')
  })

  it('onChange', () => {
    const onChange = jest.fn()
    const { rerender } = render(
      <Input
        type="number"
        name="test-input"
        onChange={onChange}
      />
    )

    const input = screen.getByTestId('input') as HTMLInputElement

    // changed value
    fireEvent.change(input, { target: { value: '31' } })
    expect(input.value).toStrictEqual('31')
    expect(onChange).toHaveBeenCalledTimes(1)

    fireEvent.change(input, { target: { value: '32' } })
    expect(input.value).toStrictEqual('32')
    expect(onChange).toHaveBeenCalledTimes(2)

    // disabled by prop
    rerender(
      <Input
        type="number"
        name="test-input"
        disabled={true}
        onChange={onChange}
      />
    )
    fireEvent.change(input, { target: { value: '33' } })
    expect(onChange).toHaveBeenCalledTimes(2)

    // disabled by form status
    mockUseFormStatus.mockReturnValueOnce({
      pending: true
    })
    rerender(
      <Input
        type="number"
        name="test-input"
        disabled={false}
        onChange={onChange}
      />
    )
    fireEvent.change(input, { target: { value: '33' } })
    expect(onChange).toHaveBeenCalledTimes(2)
  })
})
