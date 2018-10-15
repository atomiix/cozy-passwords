import React, { Component } from 'react'
import Modal, { ModalDescription } from 'cozy-ui/react/Modal'
import Label from 'cozy-ui/react/Label'
import Input from 'cozy-ui/react/Input'
import Button from 'cozy-ui/react/Button'

import { withClient } from 'cozy-client'

import kdbxweb from 'kdbxweb'

export class PasswordsNew extends Component {
  constructor(props) {
    super(props)
    this.client = props.client
    this.state = {
      filenameError: false,
      exists: false,
      passwordError: false,
      busy: false
    }
  }
  handleFilenameChange = event => {
    this.filename = event.target.value
  }
  handlePasswordChange = event => {
    this.password = event.target.value
  }
  handleFormSubmit = async event => {
    event.preventDefault()
    this.setState({
      busy: true,
      filenameError: false,
      passwordError: false,
      exists: false
    })
    if (!this.filename) {
      this.setState({ filenameError: true, busy: false })
      return
    }
    if (!this.password) {
      this.setState({ passwordError: true, busy: false })
      return
    }
    let credentials = new kdbxweb.Credentials(
      kdbxweb.ProtectedValue.fromString(this.password)
    )
    let db = kdbxweb.Kdbx.create(credentials, 'Cozy Passwords')
    let doc = await db.save()
    let file = new File([doc], this.filename, { type: 'x-application/kdbx' })
    try {
      await this.client.upload(file, '')
      this.setState({ busy: false })
      this.props.dismissAction()
    } catch (e) {
      this.setState({ exists: true, busy: false })
    }
  }
  render() {
    const { busy, filenameError, exists, passwordError } = this.state
    return (
      <Modal
        into="body"
        title="Nouveau fichier de mots de passe"
        dismissAction={this.props.dismissAction}
      >
        <ModalDescription>
          <form onSubmit={this.handleFormSubmit}>
            <Label error={filenameError || exists} htmlFor="filename">
              Nom du fichier
            </Label>
            {exists && <span>Le fichier existe déjà</span>}
            <Input
              error={filenameError || exists}
              id="filename"
              placeholder="passwords.kdbx"
              size="medium"
              onChange={this.handleFilenameChange}
            />
            <Label error={passwordError} htmlFor="password">
              Mot de passe
            </Label>
            <Input
              error={passwordError}
              id="password"
              type="password"
              size="medium"
              onChange={this.handlePasswordChange}
            />
            <br />
            <br />
            <Button busy={busy} label="Enregistrer" extension="full" />
          </form>
        </ModalDescription>
      </Modal>
    )
  }
}

export default withClient(PasswordsNew)
