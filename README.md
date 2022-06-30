# Tree in tree problem

Aim to display the data in tree structure form

#### data form
Data file is in the src folder. Where the children have its own id and Parent's id.

{
		"Parent": null,
		"detail": "1",
		"head": "root",
		"level": 0,
		"type": "Topic",
		"_id": "abcd0000"
	},
	{
		"Parent": "abcd0000",
		"detail": "1.1",
		"head": "root",
		"level": 1,
		"type": "Sub-Topic",
		"_id": "abcd0001"
	},
	{
		"Parent": "abcd0001",
		"detail": "1.1.1",
		"head": "root",
		"level": 1,
		"type": "Idea",
		"_id": "abcd0002"
	}

#### solution right now:
Use a recursive call to sort the data in multidimensional array. index 0 is the parent node follow by object children: array of children.

Use recursives call to arrange data into table to display it.
