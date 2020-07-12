import React, { useState } from "react";
import { Table, Input, InputNumber, Form, Button, Radio } from "antd";

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
	const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
	return (
		<td {...restProps}>
			{editing ? (
				<Form.Item
					name={dataIndex}
					style={{
						margin: 0,
					}}
					rules={[
						{
							required: true,
							message: `Please Input ${title}!`,
						},
					]}>
					{inputNode}
				</Form.Item>
			) : (
				children
			)}
		</td>
	);
};

const EditableTable = ({ value: data, onChange: setData, columns: columnData }) => {
	const [form] = Form.useForm();
	const [editingKey, setEditingKey] = useState("");

	const isEditing = (record) => record.key === editingKey;

	const edit = (record) => {
		form.setFieldsValue({
			name: "",
			crateChance: 0,
			...record,
		});
		setEditingKey(record.key);
	};

	const cancel = () => {
		setEditingKey("");
	};

	const save = async (key) => {
		try {
			const row = await form.validateFields();
			const newData = [...data];
			const index = newData.findIndex((item) => key === item.key);
			console.log({ newData });

			if (index > -1) {
				const item = newData[index];
				newData.splice(index, 1, { ...item, ...row });
				setData(newData);
				setEditingKey("");
			} else {
				newData.push(row);
				setData(newData);
				setEditingKey("");
			}
		} catch (errInfo) {
			console.log("Validate Failed:", errInfo);
		}
	};

	const columns = [
		...columnData,
		{
			title: "Actions",
			render: (_, record) => {
				const editable = isEditing(record);
				return editable ? (
					<Radio.Group>
						<Radio.Button onClick={() => save(record.key)}>Save</Radio.Button>
						<Radio.Button onClick={cancel}>Cancel</Radio.Button>
					</Radio.Group>
				) : (
					<Button onClick={() => edit(record)}>Edit</Button>
				);
			},
		},
	];

	const mergedColumns = columns.map((col) => {
		if (!col.editable) {
			return col;
		}

		return {
			...col,
			onCell: (record) => ({
				record,
				inputType: col.inputType,
				dataIndex: col.dataIndex,
				title: col.title,
				editing: isEditing(record),
			}),
		};
	});
	return (
		<Form form={form} component={false} layout="vertical">
			<Table
				components={{
					body: {
						cell: EditableCell,
					},
				}}
				bordered
				dataSource={data}
				columns={mergedColumns}
				rowClassName="editable-row"
				pagination={false}
				// pagination={{
				//   onChange: cancel
				// }}
			/>
		</Form>
	);
};

export default EditableTable;
