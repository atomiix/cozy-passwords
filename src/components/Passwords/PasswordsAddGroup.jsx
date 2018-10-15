import React, { Component } from 'react'
import Modal, { ModalContent } from 'cozy-ui/react/Modal'
import Label from 'cozy-ui/react/Label'
import Input from 'cozy-ui/react/Input'
import Button from 'cozy-ui/react/Button'

export class PasswordsAddGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: false
    }
  }

  handleNameChange = event => {
    this.name = event.target.value
  }

  handleSubmit = event => {
    event.preventDefault()
    this.setState({ error: false })
    if (!this.name || this.name.length <= 0) {
      this.setState({ error: true })
    } else {
      this.props.callback(this.name)
    }
  }

  render() {
    const { error } = this.state
    return (
      <Modal title="Nouveau groupe" dismissAction={this.props.dismissAction}>
        <ModalContent>
          <form onSubmit={this.handleSubmit}>
            <Label error={error} htmlFor="name">
              Nom du groupe
            </Label>
            <Input
              error={error}
              id="name"
              size="medium"
              onChange={this.handleNameChange}
            />
            <br />
            <br />
            <Button label="Enregistrer" extension="full" />
          </form>
        </ModalContent>
      </Modal>
    )
  }
}

export default PasswordsAddGroup
