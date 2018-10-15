import React, { Component } from 'react'
import Modal, { ModalDescription } from 'cozy-ui/react/Modal'
import Label from 'cozy-ui/react/Label'
import Input from 'cozy-ui/react/Input'
import Button from 'cozy-ui/react/Button'

import kdbxweb from 'kdbxweb'

export class PasswordsAddEntry extends Component {
  constructor(props) {
    super(props)
  }
  handleTitleChange = event => {
    this.title = event.target.value
  }
  handleURLChange = event => {
    this.url = event.target.value
  }
  handleUsernameChange = event => {
    this.username = event.target.value
  }
  handlePasswordChange = event => {
    this.password = event.target.value
  }
  handleForm = event => {
    event.preventDefault()
    let fields = {
      Title: this.title,
      URL: this.url,
      UserName: this.username,
      Password: kdbxweb.ProtectedValue.fromString(this.password)
    }
    this.props.callback(fields)
  }
  render() {
    let { dismissAction } = this.props
    return (
      <Modal into="body" title="Nouvelle entrée" dismissAction={dismissAction}>
        <ModalDescription>
          <form onSubmit={this.handleForm}>
            <Label htmlFor="title">Titre</Label>
            <Input id="title" size="medium" onChange={this.handleTitleChange} />
            <Label htmlFor="url">URL</Label>
            <Input id="url" size="medium" onChange={this.handleURLChange} />
            <Label htmlFor="username">Utilisateur</Label>
            <Input
              id="username"
              size="medium"
              onChange={this.handleUsernameChange}
            />
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              size="medium"
              onChange={this.handlePasswordChange}
            />
            <br />
            <br />
            <Button label="Enregistrer" extension="full" />
          </form>
        </ModalDescription>
      </Modal>
    )
  }
}

export default PasswordsAddEntry
