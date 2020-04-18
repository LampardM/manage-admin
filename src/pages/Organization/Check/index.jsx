/**
 * @Desc In User Settings Edit
 * @exports class
 * @Author jieq
 * @Date 2020-04-18 12:11:39
 * @LastEditors jieq
 * @LastEditTime 2020-04-18 15:34:49
 */
/** offcial */
import React from 'react'
import { inject } from 'mobx-react'

/** custom */
import TableData from './TableData'
import FilterForm from './FilterForm'

@inject('OrganizationCheckStore')
class CheckPage extends React.Component {
  render() {
    const { data, pagination, isTableLoading, fetchTableData } = this.props.OrganizationCheckStore

    return (
      <>
        <FilterForm />
        <TableData
          data={data}
          pagination={pagination}
          isTableLoading={isTableLoading}
          fetch={fetchTableData}
        />
      </>
    )
  }
}

export default CheckPage
