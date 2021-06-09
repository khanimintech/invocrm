import React, { useState } from 'react';
import { Field, FieldArray } from 'formik';
import Input from '../../components/Input';
import { validateRequired } from '../../utils';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import { Button, IconButton, Tooltip } from '@material-ui/core';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import ClearIcon from '@material-ui/icons/Clear';
import Typography from '@material-ui/core/Typography';


const columns ={
    1:  [
        { header: "№", field: "index", type: "text", readOnly: true },
        { header: "Məhsul adı", field: "name", type: "text" },
        { header: "Miqdarı", field: "quantity", type: "number" },
        { header: "Ö.V", field: "unit", type: "select" },
        { header: "Vahidin qiyməti (AZN)", field: "price", type: "number" },
        { header: "Cəmi qiyməti", field: "total", type: "number", readOnly: true },
    ],
    4: [
        { header: "№", field: "id", type: "text", readOnly: true },
        { header: "Müştəri adı", field: "client_name", type: "text" },
        { header: "Müqavilə №", field: "invoice_no", type: "text" },
        { header: "Tarixi", field: "date", type: "date" },
        { header: "Əlavə №", field: "annex_no", type: "number" },
        { header: "Müştəri tərəfdən ödənilmiş vəsait", field: "paids_from_customer", type: "text"},
        { header: "Agent mükafat", field: "agent_reward", type: "text"},
    ],
    5: [
        { header: "№", field: "id", type: "text", readOnly: true },
        { header: "Cihazın adı", field: "item_name", type: "text" },
        { header: "Müddət", field: "term", type: "number" },
        { header: "Ö.V", field: "unit", type: "select" },
        { header: "Miqdarı", field: "quantity", type: "number" },
        { header: "Bir günlük icarə qiyməti (AZN)", field: "one_day_rent", type: "number" },
        { header: "Cəmi qiyməti", field: "total", type: "number", readOnly: true },
    ]
}

const CreateAnnex = ({ products, units, readOnly, type, productsFieldName , total }) => {

    const [withVat, setWithVat] = useState(false);


    const arrayFieldName = productsFieldName || "products";
    const bodyTemplate = (row, col, arrayHelpers, products, index) => {
        if (col.field === "index" )
            return <span>{products[index][col.field] ? products[index][col.field] : +index  +1}</span>
        if ( col.field === "total")
            return <span>{products[index][col.field]}</span>
        return (
            <Field
                validate={total ? null : validateRequired}
                name={`${arrayFieldName}[${index}].${col.field}`}
                key={`${arrayFieldName}[${index}].${col.field}`}
            >
                {({ field, form, meta }) => {
                    return <Input
                        field={{ ...field, value: products[index][col.field]}}
                        form={form}
                        meta={meta}
                        type={col.type}
                        readOnly={col.readOnly === true }
                        size="small"
                        required
                        select={col.field === "unit"}
                        options={units ? units.map(unit => ({ label: unit.name, value: unit.id })) : []}
                        onChange={val => {
                            if (col.field === "price" || col.field === "quantity" || col.field === "one_day_rent")
                                form.setFieldValue(field.name, val < 0 ? 0 : val)
                            if (col.field === "price") {
                                form.setFieldValue(`${arrayFieldName}[${index}].total`, val * products[index].quantity)
                            }
                            if (col.field === "quantity") {
                                form.setFieldValue(`${arrayFieldName}[${index}].total`, type === 5 ? products[index].one_day_rent * val : products[index].price * val)
                            }
                            if (col.field === "one_day_rent") {
                                form.setFieldValue(`${arrayFieldName}[${index}].total`, val*products[index].quantity)
                            }
                            else form.setFieldValue(field.name, val)
                        }}
                    />
    }}
            </Field>
        )
    }

    return (
        <>
            <FieldArray
                validate={validateRequired}
                name={`${arrayFieldName}`}
                render={arrayHelpers => (
                    <div className="annex-wat-total-row">
                        <div>
                            <Field
                                name="annex.with_vat"
                            >
                                {({ field, form, meta }) => (
                                    <Input
                                        label="ƏDV"
                                        field={field}
                                        form={form}
                                        meta={meta}
                                        checkbox
                                        onChange={ checked => {
                                            form.setFieldValue(field.name, checked)
                                            setWithVat(checked)
                                        }}
                                    />
                                )}
                            </Field>
                            <Field
                                name="annex.total"
                            >
                                {({ field, form, meta }) => (
                                    <div className="annex-total-row">
                                        <Input
                                            label="Ümumi qiymət (manual)"
                                            field={field}
                                            form={form}
                                            meta={meta}
                                            size="small"
                                            type="number"
                                        />
                                        <span>{`ƏDV-li:  ${+total +(withVat  ? +total*  0.18:0)}₼`}</span>
                                    </div>
                                )}
                            </Field>

                        </div>
                        <table
                            className="p-datatable p-datatable-responsive p-datatable-gridlines product-table"
                        >
                            <thead className="p-datatable-thead">
                                {
                                    columns[type || 1].map(col => <th key={col.header}>{col.header}</th>)
                                }
                                {
                                    products.length === 1 || readOnly ? null : (
                                        <th>
                                            <Tooltip title="Sil" placement="top">
                                                <ClearIcon />
                                            </Tooltip>

                                        </th>
                                    )
                                }
                            </thead>
                            <tbody className="p-datatable-tbody">

                                {
                                    products.map((product, index) => (
                                        <tr key={product.id}>
                                            {  columns[type || "sales"].map(col => (
                                                <td>
                                                    {bodyTemplate(product, col, arrayHelpers, products, index)}
                                                </td>
                                            ))}
                                            {
                                                products.length === 1 ? null : (
                                                    <td>
                                                        <IconButton size="small" className="attach-icon" onClick={() => arrayHelpers.remove(index)} >
                                                            <HighlightOffIcon color="secondary" />
                                                        </IconButton>

                                                    </td>
                                                )
                                            }
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <br />
                        <div className="bottom-wrapper">
                            {
                                readOnly ? null : (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={<AddCircleOutlineIcon />}
                                        onClick={() => arrayHelpers.push({
                                            name: "",
                                            quantity: 0,
                                            unit: 0,
                                            price: "",
                                            total: 0,
                                            index: +products[products.length - 1].index + 1,
                                        })}
                                    >
                                        Yenisin əlavə et
                            </Button>
                                )
                            }
                        <div>
                            <Typography variant="subtitle1" gutterBottom>
								{`Ümumi: ${products.reduce((total, product) => total + product.total, 0)} ₼`}
                            </Typography>
                        
                            <Typography variant="subtitle1" gutterBottom>
                                {`ƏDV-li:  ${products.reduce((total, product) => total + product.total +  (withVat  ? product.total*  0.18 : 0), 0)} ₼`}
                            </Typography>

                        </div>
                        </div>
                    </div>
                )}
            />

        </>
    )
}


export default CreateAnnex;