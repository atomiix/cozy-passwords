import React, { Component } from 'react'
import { Content, Layout, Main } from 'cozy-ui/react/Layout'
import Spinner from 'cozy-ui/react/Spinner'
import Alerter from 'cozy-ui/react/Alerter'

import { withClient } from 'cozy-client'
import { withRouter } from 'react-router-dom'

import PasswordsUnlock from './PasswordsUnlock'
import Sidebar from './Sidebar'
import PasswordsList from './PasswordsList'
import kdbxweb from 'kdbxweb'

export class Passwords extends Component {
  constructor(props) {
    super(props)

    this.client = props.client
    this.state = {
      file: null,
      db: null,
      group: { groups: [] }
    }

    this.unlock.bind(this)
    this.updateFile.bind(this)
  }

  componentDidMount() {
    let id = this.props.match.params.id
    this.client
      .collection('io.cozy.files')
      .get(id)
      .then(file => {
        this.setState({ file: file.data })
      })
  }

  componentDidUpdate(prevProps) {
    if (this.state.db !== null && prevProps.location !== this.props.location) {
      let group = this.getRightGroup(this.state.db)
      this.setState({ group })
    }
  }

  unlock = db => {
    let group = this.getRightGroup(db)
    this.setState({ db, group })
  }

  getRightGroup = db => {
    let group
    if (this.props.match.params.group !== undefined) {
      group = db.getGroup(new kdbxweb.KdbxUuid(this.props.match.params.group))
    } else if (this.props.match.params[0] !== undefined) {
      group = db.getGroup(db.meta.recycleBinUuid)
    } else {
      group = db.getDefaultGroup()
    }
    return group
  }

  updateFile = async () => {
    const { db, file } = this.state
    this.forceUpdate()
    let doc = await db.save()
    let headers = {
      'Content-Type': 'x-application/kdbx'
    }
    if (this.props.match.params[0] !== undefined) {
      let newRecycleBin = db.getGroup(db.meta.recycleBinUuid)
      this.setState({ group: newRecycleBin })
    }
    try {
      await this.client
        .getClient()
        .fetchJSON('PUT', `/files/${file._id}`, doc, { headers })
      Alerter.success('Fichier enregistré avec succès')
    } catch (e) {
      Alerter.error('Échec de la sauvegarde du fichier', {
        duration: 5000,
        buttonText: 'Réessayer',
        buttonAction: () => this.updateFile()
      })
    }
  }

  render() {
    const { file, db, group } = this.state
    return (
      <Layout>
        <Alerter />
        <Sidebar db={db} />
        <Main>
          {!file ? (
            <Spinner size="xxlarge" middle />
          ) : (
            <Content>
              {!db ? (
                <PasswordsUnlock file={file} unlockAction={this.unlock} />
              ) : (
                <PasswordsList db={db} group={group} save={this.updateFile} />
              )}
            </Content>
          )}
        </Main>
      </Layout>
    )
  }
}

export default withRouter(withClient(Passwords))
