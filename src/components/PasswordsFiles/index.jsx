import React, { Component } from 'react'
import { queryConnect } from 'cozy-client'
import { Content, Layout, Main } from 'cozy-ui/react/Layout'
import Spinner from 'cozy-ui/react/Spinner'

import PasswordsList from './PasswordsList'
import PasswordsNew from './PasswordsNew'

const kdbxQuery = client =>
  client.find('io.cozy.files').where({ mime: 'x-application/kdbx' })

export class PasswordsFiles extends Component {
  constructor(props) {
    super(props)

    this.toggleNew = this.toggleNew.bind(this)

    this.state = {
      showNew: false
    }
  }
  toggleNew = () => {
    this.setState({ showNew: !this.state.showNew })
  }
  render() {
    const { data, fetchStatus } = this.props.files
    const { showNew } = this.state
    const isLoading = fetchStatus === 'loading' || fetchStatus === 'pending'
    return (
      <Layout monoColumn>
        <Main>
          {isLoading ? (
            <Spinner size="xxlarge" middle />
          ) : (
            <Content className="app-content">
              <h2>Vos fichiers de mots de passe</h2>
              <PasswordsList files={data} newAction={this.toggleNew} />
              {showNew && <PasswordsNew dismissAction={this.toggleNew} />}
            </Content>
          )}
        </Main>
      </Layout>
    )
  }
}

export default queryConnect({
  files: {
    query: kdbxQuery,
    as: 'files'
  }
})(PasswordsFiles)
