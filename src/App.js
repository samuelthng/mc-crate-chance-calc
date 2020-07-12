import "antd/dist/antd.css";
import React, { useState, useCallback, useMemo } from "react";
import { Form, InputNumber, Radio, Layout } from "antd";
import EditableTable from "./EditableTable";
import { calculateOdds, parseListingToB64, parseB64ToListing } from "./Utilities";

import lists from "./lists.json";
console.log({ lists });

export default function App({ match, location, history }) {
	const [keys, setKeys] = useState(1);

	const listing = useMemo(() => {
		if (match.params.b64) {
			try {
				return parseB64ToListing(match.params.b64);
			} catch (error) {
				console.error("Invalid listing parameters. Defaulting to empty list.");
				history.push("");
			}
		}
		return [];
	}, [match]);

	const setListing = useCallback(
		(listing) => (listing.length > 0 ? history.push(`/${parseListingToB64(listing)}`) : history.push("")),
		[history]
	);

	const setListingShortcut = useCallback((param) => history.push(param), [history]);

	const oddsListing = useMemo(() => {
		return calculateOdds(listing, keys);
	}, [listing, keys]);

	const removeRow = useCallback(() => {
		const l = [...listing];
		l.pop();
		setListing(l);
	}, [listing, setListing]);

	const addRow = useCallback(() => {
		const newListing = [
			...listing,
			{
				key: listing.length.toString(),
				crateChance: 0,
				name: "",
			},
		];
		setListing(newListing);
	}, [listing, setListing]);

	const columns = [
		{
			title: "Item",
			dataIndex: "name",
			editable: true,
			inputType: "text",
			sorter: {
				compare: (a, b) => {
					if (a.name > b.name) return 1;
					else return -1;
				},
			},
		},
		{
			title: "Crate Chance",
			dataIndex: "crateChance",
			editable: true,
			inputType: "number",
			sorter: {
				compare: (a, b) => a.crateChance - b.crateChance,
			},
		},
		{
			title: "Actual Chance (1 Key)",
			dataIndex: "actualChance",
			editable: false,
			sorter: {
				compare: (a, b) => a.actualChance - b.actualChance,
			},
			render: (value) => (typeof value === "number" ? `${parseFloat(value).toFixed(2)}%` : value),
		},
		{
			title: "Failure Rate (1 Key)",
			dataIndex: "failureRate",
			editable: false,
			sorter: {
				compare: (a, b) => a.failureRate - b.failureRate,
			},
			render: (value) => (typeof value === "number" ? `${parseFloat(value).toFixed(2)}%` : value),
		},
		{
			title: `Chance for ≥ 1`,
			dataIndex: "multipliedFailure",
			editable: false,
			sorter: {
				compare: (a, b) => a.multipliedFailure - b.multipliedFailure,
			},
			render: (value) => {
				if (typeof value === "number") {
					const valueString = `${parseFloat(value).toFixed(2)}%`;
					if (value >= 90) {
						return (
							<span
								style={{
									fontWeight: "bold",
									color: "lime",
								}}>
								{valueString}
							</span>
						);
					}
					return valueString;
				}
				return value;
			},
		},
	];

	return (
		<Layout style={{ userSelect: "none" }}>
			<Layout.Header style={{ backgroundColor: "#222230" }}>
				<h1 style={{ color: "#eee" }}>Crate Chance Calculator</h1>
			</Layout.Header>
			<Layout.Content style={{ padding: "1em" }}>
				<div style={{ display: "flex" }}>
					<Form layout="horizontal">
						<Form.Item label="Keys/Attempts">
							<InputNumber min={1} value={keys} onChange={setKeys} />
						</Form.Item>
					</Form>
					<Radio.Group style={{ marginLeft: "auto", alignSelf: "end" }}>
						{Object.entries(lists).map(([key, value]) => (
							<Radio.Button onClick={() => setListingShortcut(value)} disabled={match.params.b64 === value}>
								{key}
							</Radio.Button>
						))}
					</Radio.Group>
					<Radio.Group style={{ marginLeft: "auto", alignSelf: "end" }}>
						<Radio.Button onClick={addRow}>Add Row</Radio.Button>
						<Radio.Button onClick={removeRow}>Remove Row</Radio.Button>
					</Radio.Group>
				</div>
				<EditableTable value={oddsListing} onChange={setListing} columns={columns} />
				<div style={{ display: "flex", marginTop: "1em" }}>
					<Form layout="horizontal">
						<Form.Item label="Keys/Attempts">
							<InputNumber min={1} value={keys} onChange={setKeys} />
						</Form.Item>
					</Form>
					<Radio.Group style={{ marginLeft: "auto", alignSelf: "end" }}>
						<Radio.Button onClick={addRow}>Add Row</Radio.Button>
						<Radio.Button onClick={removeRow}>Remove Row</Radio.Button>
					</Radio.Group>
				</div>
			</Layout.Content>
			<Layout.Footer style={{ display: "flex", backgroundColor: "#333340", color: "#eee" }}>
				<a href="https://samuel.thng.sg" style={{ color: "#eee" }}>
					samuel.thng.sg
				</a>
				<span style={{ marginLeft: "auto" }}>Copyright &copy; Samuel Thng 2020</span>
			</Layout.Footer>
		</Layout>
	);
}
