import React from 'react'
import { action } from '@storybook/addon-actions'
// @ts-ignore
import { Button } from '@storybook/react/demo'

import { Home } from '~/Home'

export default {
    title: 'Button',
}

export const text = () => (
    <Button onClick={action('clicked')}>Hello Button</Button>
)

export const home = () => <Home />

export const emoji = () => (
    <Button onClick={action('clicked')}>
        <span role="img" aria-label="so cool">
            😀 😎 👍 💯
        </span>
    </Button>
)
