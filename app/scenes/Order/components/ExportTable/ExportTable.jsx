import React, { Component } from 'react';
import Workbook from 'react-excel-workbook';

class ExportTable extends Component {
    render() {
        return <Workbook filename={`order-service-${this.props.status}.xlsx`} element={<button type="button" className="btn btn-primary btn-cons btn-animated from-top fa fa-arrow-down">
        <span>Download Data</span>
      </button>}>
        <Workbook.Sheet data={this.props.data} name="Orders">
            <Workbook.Column label="Nama" value="nama (sesuai line)"/>
            <Workbook.Column label="Alamat" value="alamat yang dituju (patokan)"/>
            <Workbook.Column label="No Telepon" value="no telepon (wajib diisi)"/>
            <Workbook.Column label="Pesanan" value="pesanan"/>
            <Workbook.Column label="Catatan" value="catatan"/>
            <Workbook.Column label="Status" value="orderStatus"/>
            <Workbook.Column label="Driver" value="driverName"/>
        </Workbook.Sheet>
    </Workbook>
    }
}

export default ExportTable