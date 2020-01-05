import { storiesOf } from '@storybook/react'
import React from 'react'

// @ts-ignore
import { withInfo } from '@storybook/addon-info'
import { action } from '@storybook/addon-actions'
import Button from '~/views/components/Button'

export default {
    title: 'Button',
}

const stories = storiesOf('Components', module)

stories.add(
    'Button',
    withInfo({})(() => <Button value="Hello" onClick={action('onClick')} />),
)
