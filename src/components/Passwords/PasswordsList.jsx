import React, { Component } from 'react'
import Button from 'cozy-ui/react/Button'
import Alerter from 'cozy-ui/react/Alerter'
import Icon from 'cozy-ui/react/Icon'
import { Link, withRouter } from 'react-router-dom'

import { dodgerBlue, pomegranate } from 'cozy-ui/stylus/settings/palette'

import PasswordsAddEntry from './PasswordsAddEntry'
import PasswordsAddGroup from './PasswordsAddGroup'

export class PasswordsList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showNewEntry: false,
      showNewGroup: false
    }
  }

  newEntryCallback = fields => {
    const { db, group } = this.props
    let entry = db.createEntry(group)
    entry.fields = fields
    this.setState({ showNewEntry: false })
    this.props.save()
  }

  newGroupCallback = name => {
    const { db, group } = this.props
    db.createGroup(group, name)
    this.setState({ showNewGroup: false })
    this.props.save()
  }

  copyToClipboard = str => {
    const el = document.createElement('textarea')
    el.value = str
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    document.body.removeChild(el)
  }

  delete = (entry, event) => {
    event.preventDefault()
    const { db } = this.props
    db.remove(entry)
    this.props.save()
  }

  usernameClicked = str => {
    this.copyToClipboard(str)
    Alerter.info('Utilisateur copié !')
  }

  passwordClicked = str => {
    this.copyToClipboard(str)
    Alerter.info('Mot de passe copié !')
  }

  urlClicked = str => {
    window.open(str, '_blank')
  }

  emptyRecycleBin = () => {
    const { db } = this.props
    let recycleBin = db.getGroup(db.meta.recycleBinUuid)
    db.meta.recycleBinEnabled = false
    db.remove(recycleBin)
    db.createRecycleBin()
    this.props.save()
  }

  crumb = (group, recycleBin, parts) => {
    if (!parts) {
      parts = []
    }
    parts.unshift(group)
    if (
      group.parentGroup &&
      group.uuid.toString() !== this.props.db.meta.recycleBinUuid.toString()
    ) {
      return this.crumb(group.parentGroup, recycleBin, parts)
    }
    return parts.map((part, i) => {
      if (i + 1 < parts.length) {
        return (
          <Link
            key={i}
            to={`/passwords/${this.props.match.params.id}${recycleBin}/${
              part.uuid
            }`}
          >
            {part.name}
            <Icon icon="forward" />
          </Link>
        )
      } else {
        return <span key={i}>{part.name}</span>
      }
    })
  }

  render() {
    const { showNewEntry, showNewGroup } = this.state
    const { db, group, match } = this.props
    const recycleBin =
      match.params[0] !== undefined ? `/${match.params[0]}` : ''
    return (
      <div>
        <div className="toolbar">
          <h2>{this.crumb(group, recycleBin)}</h2>
          {recycleBin === '' ? (
            <div>
              <Button
                label="Nouvelle entrée"
                icon="plus"
                onClick={() => {
                  this.setState({ showNewEntry: true })
                }}
              />
              <Button
                label="Nouveau groupe"
                icon="plus"
                onClick={() => {
                  this.setState({ showNewGroup: true })
                }}
              />
            </div>
          ) : (
            <Button
              label="Vider la corbeille"
              icon="delete"
              theme="danger"
              onClick={this.emptyRecycleBin}
            />
          )}
        </div>
        <div className="entries-table">
          <div className="entries-head">
            <span className="title">Titre</span>
            <span className="url">URL</span>
            <span className="username">Utilisateur</span>
            <span className="password">Mot de passe</span>
            <span className="actions" />
          </div>
          <div className="entries-body">
            {group.groups.map(group => {
              if (group.uuid.toString() !== db.meta.recycleBinUuid.toString()) {
                return (
                  <Link
                    to={`/passwords/${
                      this.props.match.params.id
                    }${recycleBin}/${group.uuid}`}
                    className="entry"
                    key={group.uuid}
                  >
                    <span>
                      <Icon icon="folder" size="24" color={dodgerBlue} />
                      {group.name}
                    </span>
                    <span>-</span>
                    <span>-</span>
                    <span>-</span>
                    {!recycleBin && (
                      <span
                        className="actions"
                        onClick={this.delete.bind(this, group)}
                      >
                        <Icon icon="delete" color={pomegranate} />
                      </span>
                    )}
                  </Link>
                )
              }
            })}
            {group.entries.map(entry => (
              <div className="entry" key={entry.uuid}>
                <span>
                  <Icon icon="file" size="24" color={dodgerBlue} />
                  {entry.fields.Title}
                </span>
                <span onClick={this.urlClicked.bind(this, entry.fields.URL)}>
                  {entry.fields.URL}
                </span>
                <span
                  onClick={this.usernameClicked.bind(
                    this,
                    entry.fields.UserName
                  )}
                >
                  {entry.fields.UserName}
                </span>
                <span
                  onClick={this.passwordClicked.bind(
                    this,
                    entry.fields.Password.getText()
                  )}
                >
                  {entry.fields.Password.getText()
                    .split('')
                    .map(() => '•')}
                </span>
                {!recycleBin && (
                  <span
                    className="actions"
                    onClick={this.delete.bind(this, entry)}
                  >
                    <Icon icon="delete" color={pomegranate} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        {showNewEntry && (
          <PasswordsAddEntry
            callback={this.newEntryCallback}
            dismissAction={() => {
              this.setState({ showNewEntry: false })
            }}
          />
        )}
        {showNewGroup && (
          <PasswordsAddGroup
            callback={this.newGroupCallback}
            dismissAction={() => {
              this.setState({ showNewGroup: false })
            }}
          />
        )}
      </div>
    )
  }
}

export default withRouter(PasswordsList)
