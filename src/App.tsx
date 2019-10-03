import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { Home } from '~/Home'
import hello from './protos/hello.proto'

console.log(JSON.stringify(hello))

const App: React.FC = () => (
    <Switch>
        <Route exact path="/" component={Home} />
    </Switch>
)

export default App
