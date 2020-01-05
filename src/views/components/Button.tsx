import React from 'react'

interface Props {
    /**
     * Value to display, either empty (" ") or "X" / "O".
     *
     * @default " "
     **/
    value?: string

    /** Called when an empty cell is clicked. */
    onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
}

const Button: React.SFC<Props> = (props: Props) => {
    return <button onClick={props.onClick}>{props.value}</button>
}

export default Button
