import React, { Component } from 'react'
import { withRouter, Link } from 'react-router-dom'
import Icon from 'cozy-ui/react/Icon'
import Button from 'cozy-ui/react/Button'
import { SubTitle } from 'cozy-ui/react/Text'
import palette from 'cozy-ui/stylus/settings/palette'

export class PasswordsList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { files, location } = this.props
    return (
      <div className="item-list">
        <div className="item-wrapper --add-file" onClick={this.props.newAction}>
          <div className="icon-wrapper">
            <Icon icon="plus" size="32" color={palette.dodgerBlue} />
          </div>
          <Button label="Nouveau fichier" subtle />
        </div>
        {files.map(file => (
          <Link
            key={file._id}
            to={location.pathname + '/' + file._id}
            className="item-wrapper"
          >
            <div className="icon-wrapper">
              <Icon icon="file" size="32" color={palette.mango} />
            </div>
            <SubTitle>{file.name}</SubTitle>
          </Link>
        ))}
      </div>
    )
  }
}

export default withRouter(PasswordsList)
