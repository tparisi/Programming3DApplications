{

"metadata" :
{
	"formatVersion" : 3.2,
	"type"          : "scene",
	"sourceFile"    : "flash drive 257b 004.blend",
	"generatedBy"   : "Blender 2.66 Exporter",
	"objects"       : 4,
	"geometries"    : 2,
	"materials"     : 5,
	"textures"      : 0
},

"urlBaseType" : "relativeToScene",


"objects" :
{
	"cap" : {
		"geometry"  : "geo_Plane.001",
		"groups"    : [  ],
		"material"  : "black",
		"position"  : [ 0.0530009, -1.74978e-07, 5.11204 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"flash drive" : {
		"geometry"  : "geo_Plane",
		"groups"    : [  ],
		"material"  : "",
		"position"  : [ 0, 0, 0 ],
		"rotation"  : [ -1.5708, 0, 0 ],
		"quaternion": [ -0.707107, 0, 0, 0.707107 ],
		"scale"     : [ 1, 1, 1 ],
		"visible"       : true,
		"castShadow"    : false,
		"receiveShadow" : false,
		"doubleSided"   : false
	},

	"default_light" : {
		"type"       : "DirectionalLight",
		"direction"  : [ 0, 1, 1 ],
		"color"      : 16777215,
		"intensity"  : 0.80
	},

	"default_camera" : {
		"type"  : "PerspectiveCamera",
		"fov"   : 60.000000,
		"aspect": 1.333000,
		"near"  : 1.000000,
		"far"   : 10000.000000,
		"position": [ 0, 0, 10 ],
		"target"  : [ 0, 0, 0 ]
	}
},


"geometries" :
{
	"geo_Plane.001" : {
		"type" : "ascii",
		"url"  : "flashdrive.Plane.001.js"
	},

	"geo_Plane" : {
		"type" : "ascii",
		"url"  : "flashdrive.Plane.js"
	}
},


"materials" :
{
	"black" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 131586, "opacity": 1, "blending": "NormalBlending" }
	},

	"chrome" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 13421778, "opacity": 1, "blending": "NormalBlending" }
	},

	"Silver" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 11184810, "opacity": 1, "blending": "NormalBlending" }
	},

	"Silver.001" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 11184810, "opacity": 1, "blending": "NormalBlending" }
	},

	"white" : {
		"type": "MeshLambertMaterial",
		"parameters": { "color": 14277081, "opacity": 1, "blending": "NormalBlending" }
	}
},


"transform" :
{
	"position"  : [ 0, 0, 0 ],
	"rotation"  : [ -1.5708, 0, 0 ],
	"scale"     : [ 1, 1, 1 ]
},

"defaults" :
{
	"bgcolor" : [ 0, 0, 0 ],
	"bgalpha" : 1.000000,
	"camera"  : "default_camera"
}

}
