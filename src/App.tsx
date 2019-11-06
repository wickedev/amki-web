import '~/index.css'
import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Home } from '~/Home'

export const App: React.FC = () => {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
        </Switch>
    )
}
