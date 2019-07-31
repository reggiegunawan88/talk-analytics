import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import Modal from 'react-responsive-modal';

import PropTypes from 'prop-types';

import Button from 'shared_components/Button';
import Input from 'shared_components/Input';
import Dropdown from 'shared_components/Dropdown';

import { formattedMessageHelper } from 'Modules/helper/utility';

import styles from './styles.scss';

class AgentAdmin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditModalOpen: false,
      isAddModalOpen: false,
      roleList: [
        { value: 'super-admin', label: 'Super Admin' },
        { value: 'admin', label: 'Admin' },
        { value: 'cxd', label: 'CXD' }
      ],

      selectedAgent: {
        name: '',
        email: '',
        role: '',
      },

      newAgent: {
        name: '',
        email: '',
        role: ''
      }
    }

    this.openEditModal = this.openEditModal.bind(this);
    this.closeEditModal = this.closeEditModal.bind(this);

    this.openAddModal = this.openAddModal.bind(this);
    this.closeAddModal = this.closeAddModal.bind(this);

    this.agentDropdownChange = this.agentDropdownChange.bind(this);

    this.newAgentDropdownChange = this.newAgentDropdownChange.bind(this);

    this.addNewUser = this.addNewUser.bind(this);
    this.editUser = this.editUser.bind(this);
  }

  onChange(e, action) {
    const newVal = this.state;
    const { name } = e;
    let { value } = e;
    
    if (name === "email") {
      value = value.replace(/\s/g,'');
    }
    newVal[action] = {
      ...newVal[action],
      [name]: value
    }

    this.setState(newVal);
  }

  openAddModal() {
    this.setState({ isAddModalOpen: true })
  }

  closeAddModal() {
    this.setState({ isAddModalOpen: false, newAgent: { name: '', email: '', role: '' } })
  }

  openEditModal(e) {
    const { agentList } = this.props
    const { currentTarget: { dataset: { index } } } = e
    this.setState({ isEditModalOpen: true, selectedAgent: agentList[index] })
  }

  closeEditModal() {
    this.setState({ isEditModalOpen: false, selectedAgent: { name: '', email: '', role: '' } })
  }

  newAgentDropdownChange(name, { value }) {
    const { newAgent } = this.state;
    this.setState({ newAgent: { ...newAgent, [name]: value } });
  }

  agentDropdownChange(name, { value }) {
    const { selectedAgent } = this.state;

    this.setState({ selectedAgent: { ...selectedAgent, [name]: value } });
  }

  addNewUser(e) {
    e.preventDefault();

    const { newAgent } = this.state;

    this.props.createNewAgent(newAgent);
    this.closeAddModal();
  }

  editUser(e) {
    e.preventDefault();

    const { selectedAgent } = this.state;
    
    this.props.editAgent({ ...selectedAgent });
    this.closeEditModal();
  }

  renderTableRow(data, index) {
    const { name, email, channel } = data;
    
    const role = channel.find(c => c.channelId === this.props.channelActive.id ).role;
    return (
      <tr key={data.id} className={`${styles["table-row"]}`}>
        <td className={`${styles["table-col"]}`}>{name}</td>
        <td className={`${styles["table-col"]}`}>{email}</td>
        <td className={`${styles["table-col"]}`}>{role}</td>
        <td className={`${styles["table-col"]} ${styles["table-action"]}`}>
          <Button onClick={this.openEditModal} base={{ "data-index": index }} className="btn-ghost btn-primary"><i className="fa fa-pencil" />&nbsp;Edit</Button>
          {/* <Button onClick={this.deleteUser} className="btn-ghost btn-primary"><i className="fa fa-trash" />&nbsp;Delete</Button> */}
        </td>
      </tr>
    )
  }

  render() {
    const { agentList } = this.props;

    return (
      <div>
        <div className="col-xs-12 p-l-0 p-r-0 p-t-20">
          <div className={`row ${styles["first-row"]}`}>
            <div className="col-xs-12">
              <span className={`${styles.title}`}>List Of Agent</span>
              <Button onClick={this.openAddModal} className={`btn-ghost btn-primary pull-right ${styles['btn-add']}`}>+ Add Agent</Button>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className={`table-responsive ${styles["agent__table-responsive"]}`}>
                <table className={`table ${styles.agent__table}`}>
                  <thead>
                    <tr>
                      <th className={`${styles["table-header"]}`}>Name</th>
                      <th className={`${styles["table-header"]}`}>Email</th>
                      <th className={`${styles["table-header"]}`}>Role</th>
                      <th className={`${styles["table-header"]}`} />
                    </tr>
                  </thead>
                  <tbody>
                    {
                      agentList.map((data, index) => this.renderTableRow(data, index))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* TODO: Refactor Modal. Use 1 modal render content based on state */}
        <Modal
          classNames={{ modal: styles['agent-admin--modal'] }}
          open={this.state.isAddModalOpen}
          onClose={this.closeAddModal}
          center
        >
          <b>
            <FormattedMessage id="channelManagement.addAgent" />
          </b>

          <p className="fg-shade m-t-20">
            <FormattedMessage id="profile.fillForm" />
          </p>

          <form onSubmit={this.addNewUser}>
            <div className="row">
              <div className="col-xs-12">
                <Input
                  onChange={(e) => this.onChange(e,'newAgent')}
                  label={formattedMessageHelper('profile.name')}
                  styles="form-group-default"
                  ref={el => {
                    this.newAgentNameInput = el;
                  }}
                  base={{
                    name: 'name',
                    value: this.state.newAgent.name,
                    // disabled: isFetching,
                  }}
                  required
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <Dropdown
                  onChange={this.newAgentDropdownChange}
                  label={formattedMessageHelper('profile.role')}
                  options={this.state.roleList}
                  className="m-b-10"
                  ref={el => {
                    this.newAgentRoleInput = el;
                  }}
                  base={{
                    name: 'role',
                    required: true,
                    value: this.state.newAgent.role || '',
                    // isLoading: isFetching,
                  }}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                <Input
                  onChange={(e) => this.onChange(e,'newAgent')}
                  label={formattedMessageHelper('profile.email')}
                  styles="form-group-default"
                  ref={el => {
                    this.newAgentEmailInput = el;
                  }}
                  base={{
                    name: 'email',
                    value: this.state.newAgent.email,
                    // disabled: isFetching,
                  }}
                  required
                />
              </div>
            </div>
            <Button className="btn-primary btn-block m-t-20">
              <FormattedMessage id="channelManagement.save" />
            </Button>
          </form>
        </Modal>

        <Modal
          classNames={{ modal: styles['agent-admin--modal'] }}
          open={this.state.isEditModalOpen}
          onClose={this.closeEditModal}
          center
        >
          <b>
            <FormattedMessage id="channelManagement.editAgent" />
          </b>

          <p className="fg-shade m-t-20">
            <FormattedMessage id="profile.fillForm" />
          </p>

          <form onSubmit={this.editUser}>
            <div className="row">
              <Input
                onChange={(e) => this.onChange(e,'selectedAgent')}
                label={formattedMessageHelper('profile.name')}
                styles="form-group-default"
                ref={el => {
                  this.agentNameInput = el;
                }}
                base={{
                  name: 'name',
                  value: this.state.selectedAgent.name,
                  // disabled: isFetching,
                }}
                required
              />
            </div>

            <div className="row">
              <div className="col-xs-12">
                <Dropdown
                  onChange={this.agentDropdownChange}
                  label={formattedMessageHelper('profile.role')}
                  options={this.state.roleList}
                  className="m-b-10"
                  base={{
                    name: 'role',
                    required: true,
                    value: this.state.selectedAgent.role || ''
                  }}
                />
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12">
                <Input
                  onChange={(e) => this.onChange(e,'selectedAgent')}
                  label={formattedMessageHelper('profile.email')}
                  styles="form-group-default"
                  ref={el => {
                    this.agentEmailInput = el;
                  }}
                  base={{
                    name: 'email',
                    value: this.state.selectedAgent.email,
                    // disabled: isFetching,
                  }}
                  required
                />
              </div>
            </div>
            <Button className="btn-primary btn-block m-t-20">
              <FormattedMessage id="channelManagement.save" />
            </Button>
          </form>
        </Modal>
      </div>
    )
  }
}

export default AgentAdmin
/* eslint-disable */
AgentAdmin.propTypes = {
  agentList: PropTypes.array,
  isFetching: PropTypes.bool.isRequired,
  getAllAgent: PropTypes.func,
  createNewAgent: PropTypes.func.isRequired,
  editAgent: PropTypes.func.isRequired,
  channelActive: PropTypes.any,
};
/* eslint-enable */

AgentAdmin.defaultProps = {
  agentList: [],
  channelActive: {}
};
