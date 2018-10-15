import React, { Component } from 'react'
import Modal, { ModalDescription } from 'cozy-ui/react/Modal'
import Label from 'cozy-ui/react/Label'
import Input from 'cozy-ui/react/Input'
import Button from 'cozy-ui/react/Button'

import { withClient } from 'cozy-client'

import kdbxweb from 'kdbxweb'

export class PasswordsUnlock extends Component {
  constructor(props) {
    super(props)
    this.client = props.client
    this.state = {
      error: false,
      busy: false
    }
  }

  handlePasswordChange = event => {
    this.password = event.target.value
  }

  handleSubmit = async event => {
    event.preventDefault()
    this.setState({ busy: true, error: false })
    if (this.file === undefined) {
      let link = await this.client
        .collection('io.cozy.files')
        .getDownloadLinkById(this.props.file._id)
      let data = await fetch(link)
      this.file = await data.arrayBuffer()
    }
    let credentials = new kdbxweb.Credentials(
      kdbxweb.ProtectedValue.fromString(this.password)
    )
    try {
      let db = await kdbxweb.Kdbx.load(this.file, credentials)
      this.props.unlockAction(db)
    } catch (e) {
      this.setState({ error: true, busy: false, e })
    }
  }

  render() {
    const { error, busy } = this.state
    return (
      <Modal into="body" title="Dévérouiller le fichier">
        <ModalDescription>
          <form onSubmit={this.handleSubmit}>
            <Label error={error} htmlFor="password">
              Mot de passe
            </Label>
            <Input
              error={error}
              id="password"
              type="password"
              size="medium"
              onChange={this.handlePasswordChange}
            />
            <br />
            <br />
            <Button busy={busy} label="Dévérouiller" extension="full" />
          </form>
        </ModalDescription>
      </Modal>
    )
  }
}

export default withClient(PasswordsUnlock)
