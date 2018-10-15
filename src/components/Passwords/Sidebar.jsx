import React from 'react'
import CosySidebar from 'cozy-ui/react/Sidebar'
import { NavLink } from 'react-router-dom'
import Nav, {
  NavItem,
  NavIcon,
  NavText,
  NavLink as CNavLink
} from 'cozy-ui/react/Nav'
import { withRouter } from 'react-router-dom'

export const Sidebar = props => {
  if (!props.db) {
    return <CosySidebar />
  }
  const mainGroup = props.db.getDefaultGroup()
  const recycleBinGroup = props.db.getGroup(props.db.meta.recycleBinUuid)
  const isActive = () => {
    return props.match.params[0] === undefined
  }
  return (
    <CosySidebar>
      <Nav>
        <NavItem>
          <NavLink
            to={'/passwords/' + props.match.params.id}
            className={CNavLink.className}
            activeClassName={CNavLink.activeClassName}
            isActive={isActive}
          >
            <NavIcon icon="folder" />
            <NavText>{mainGroup.name}</NavText>
          </NavLink>
        </NavItem>
        {recycleBinGroup && (
          <NavItem>
            <NavLink
              to={'/passwords/' + props.match.params.id + '/Recycle Bin'}
              className={CNavLink.className}
              activeClassName={CNavLink.activeClassName}
            >
              <NavIcon icon="delete" />
              <NavText>Corbeille</NavText>
            </NavLink>
          </NavItem>
        )}
      </Nav>
    </CosySidebar>
  )
}

export default withRouter(Sidebar)
