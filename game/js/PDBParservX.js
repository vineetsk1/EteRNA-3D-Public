THREE.PDBParser = function() { };


function Residue(name, residue) {
    this.atoms = [];
    this.name = name; // g a c u
    this.id = residue; // A1401
}

function BasePair(res1, res2, r, c) {
	this.residue1 = res1;
	this.residue2 = res2;
	this.rotation = r;
	this.center = c;
	this.atoms = []
	this.bp_type = ""
}

function PDBModel (id) {
	this.id = id;
	this.atoms = {};
	this.atommap = {};
	this.bonds = [];
	this.bhash = {};
	this.residues = [];
	this.residueObjs = [];
	this.sequence = {};
}

THREE.PDBParser.prototype = {
	constructor: THREE.OBJLoader,

	loadBonds: true,
	createBonds: false,
	
	colors: { "h":[255, 255, 192], "he":[217, 255, 255], "li":[204, 128, 255], "be":[194, 255, 0], "b":[255, 181, 181], "c":[80, 80, 80], "n":[130, 199, 222], "o":[255, 50, 50], "f":[144, 224, 80], "ne":[179, 227, 245], "na":[171, 92, 242], "mg":[138, 255, 0], "al":[191, 166, 166], "si":[240, 200, 160], "p":[255, 128, 0], "s":[255, 255, 48], "cl":[31, 240, 31], "ar":[128, 209, 227], "k":[143, 64, 212], "ca":[61, 255, 0], "sc":[230, 230, 230], "ti":[191, 194, 199], "v":[166, 166, 171], "cr":[138, 153, 199], "mn":[155, 122, 199], "fe":[224, 102, 51], "co":[240, 144, 160], "ni":[80, 208, 80], "cu":[200, 128, 51], "zn":[125, 128, 176], "ga":[194, 143, 143], "ge":[102, 143, 143], "as":[189, 128, 227], "se":[255, 161, 0], "br":[166, 41, 41], "kr":[92, 184, 209], "rb":[112, 46, 176], "sr":[0, 255, 0], "y":[148, 255, 255], "zr":[148, 224, 224], "nb":[115, 194, 201], "mo":[84, 181, 181], "tc":[59, 158, 158], "ru":[36, 143, 143], "rh":[10, 125, 140], "pd":[0, 105, 133], "ag":[192, 192, 192], "cd":[255, 217, 143], "in":[166, 117, 115], "sn":[102, 128, 128], "sb":[158, 99, 181], "te":[212, 122, 0], "i":[148, 0, 148], "xe":[66, 158, 176], "cs":[87, 23, 143], "ba":[0, 201, 0], "la":[112, 212, 255], "ce":[255, 255, 199], "pr":[217, 255, 199], "nd":[199, 255, 199], "pm":[163, 255, 199], "sm":[143, 255, 199], "eu":[97, 255, 199], "gd":[69, 255, 199], "tb":[48, 255, 199], "dy":[31, 255, 199], "ho":[0, 255, 156], "er":[0, 230, 117], "tm":[0, 212, 82], "yb":[0, 191, 56], "lu":[0, 171, 36], "hf":[77, 194, 255], "ta":[77, 166, 255], "w":[33, 148, 214], "re":[38, 125, 171], "os":[38, 102, 150], "ir":[23, 84, 135], "pt":[208, 208, 224], "au":[255, 209, 35], "hg":[184, 184, 208], "tl":[166, 84, 77], "pb":[87, 89, 97], "bi":[158, 79, 181], "po":[171, 92, 0], "at":[117, 79, 69], "rn":[66, 130, 150], "fr":[66, 0, 102], "ra":[0, 125, 0], "ac":[112, 171, 250], "th":[0, 186, 255], "pa":[0, 161, 255], "u":[0, 143, 255], "np":[0, 128, 255], "pu":[0, 107, 255], "am":[84, 92, 242], "cm":[120, 92, 227], "bk":[138, 79, 227], "cf":[161, 54, 212], "es":[179, 31, 212], "fm":[179, 31, 186], "md":[179, 13, 166], "no":[189, 13, 135], "lr":[199, 0, 102], "rf":[204, 0, 89], "db":[209, 0, 79], "sg":[217, 0, 69], "bh":[224, 0, 56], "hs":[230, 0, 46], "mt":[235, 0, 38], "ds":[235, 0, 38], "rg":[235, 0, 38]},
	rulesG: {"o5'" : ["c5'" ], "o4'" : ["c1'" ], "n1" : ["h1", "c6" ], "n2" : ["h21", "h22" ], "o2'" : ["h2'" ], "n9" : ["c4", "c8" ], "c2" : ["n2", "n1", "*n3" ], "p" : ["op1", "op2", "o5'", "op3" ], "op3" : ["ho5'"], "c4" : ["n3", "*c5" ], "c5" : ["n7" ], "c6" : ["c5", "*o6" ], "c5'" : ["c4'", "h5'", "h5''" ], "c8" : ["h8" ], "c3'" : ["o3'", "h3'" ], "c4'" : ["o4'", "c3'", "h4'" ], "c1'" : ["n9", "c2'", "h1'" ], "c2'" : ["c3'", "o2'", "h2''"], "n7" : ["*c8"]},
	rulesA: {"o5'" : ["c5'" ], "o4'" : ["c1'" ], "o2'" : ["h2'" ], "n6" : ["h61", "h62" ], "n9" : ["c4", "c8" ], "c2" : ["n1", "h2", "*n3" ], "p" : ["op1", "op2", "o5'" ], "c4" : ["n3", "*c5" ], "c5" : ["n7" ], "c6" : ["n6", "c5" ], "c5'" : ["c4'", "h5'", "h5''" ], "c8" : ["h8" ], "c3'" : ["o3'", "h3'" ], "c4'" : ["o4'", "c3'", "h4'" ], "c1'" : ["n9", "c2'", "h1'" ], "c2'" : ["c3'", "o2'", "h2''" ], "n1" : ["*c6"], "n7" : ["*c8"]},
	rulesC: {"ho3'" : ["o3'"], "o5'" : ["c5'" ], "o4'" : ["c1'" ], "n1" : ["c2", "c6" ], "o2'" : ["h2'" ], "n4" : ["h41", "h42" ], "c2" : ["n3", "*o2" ], "p" : ["op1", "op2", "o5'" ], "c4" : ["n4", "c5" ], "c5" : ["h5", "*c6" ], "c6" : ["h6" ], "c5'" : ["c4'", "h5'", "h5''" ], "c3'" : ["o3'", "h3'" ], "c4'" : ["o4'", "c3'", "h4'" ], "c1'" : ["n1", "c2'", "h1'" ], "c2'" : ["c3'", "o2'", "h2''" ], "n3" : ["*c4"]},
	rulesT: { "o5'" : ["c5'" ], "o4'" : ["c1'" ], "n1" : ["c2", "c6" ], "n3" : ["h3", "c4" ], "o2'" : ["h2'" ], "c2" : ["n3", "*o2" ], "p" : ["op1", "op2", "o5'" ], "c4" : ["c5", "*o4" ], "c5" : ["c5m", "*c6" ], "c6" : ["h6" ], "c5'" : ["c4'", "h5'", "h5''" ], "c3'" : ["o3'", "h3'" ], "c4'" : ["o4'", "c3'", "h4'" ], "c1'" : ["n1", "c2'", "h1'" ], "c2'" : ["c3'", "o2'", "h2''" ], "c5m" : ["h51", "h52", "h53" ]},
	rulesU: { "o5'" : ["c5'" ], "o4'" : ["c1'" ], "n1" : ["c2", "c6" ], "n3" : ["h3", "c4" ], "o2'" : ["h2'" ], "c2" : ["n3", "*o2" ], "p" : ["op1", "op2", "o5'" ], "c4" : ["c5", "*o4" ], "c5" : ["h5", "*c6" ], "c6" : ["h6" ], "c5'" : ["c4'", "h5'", "h5''" ], "c3'" : ["o3'", "h3'" ], "c4'" : ["o4'", "c3'", "h4'" ], "c1'" : ["n1", "c2'", "h1'" ], "c2'" : ["c3'", "o2'", "h2''" ]},

	loadFile: function(url, pdbCallback, datCallback, dssrCallback) {
		this.loadAjaxFile(url, pdbCallback, 1, this);
		this.loadAjaxFile(url.substring(0, url.lastIndexOf("/")) +"/ref_frames.dat", datCallback, 0, this);
		this.loadAjaxFile(url.substring(0, url.lastIndexOf(".pdb")) + "_dssr.out", dssrCallback, 2, this);
	},

	parseDSSR: function(context, text) {
		var lines = text.split("\n");
		var startIndex = -1;
		var endIndex = -1;
		for(var i = 0; i < lines.length; i++) {
			if(lines[i].match(/List of [0-9]+ base pairs/g)) startIndex = i;
			if(startIndex != -1 && lines[i].indexOf("*") >= 0) { endIndex = i; break; }
		}
		console.log(startIndex + " " + endIndex);
		var data = [];
		for(var i = startIndex+2; i < endIndex; i++) {
			var d = lines[i].trim().split(/\s+/);
			if(d[0].match(/[0-9]+/g) && d.length==8) {
				data.push([d[1], d[2], d[7]]);
			}
		}
		return data;
	},

	loadAjaxFile: function(url, callback, fileType, context) {
		var xhr = new XMLHttpRequest();
		var length = 0;

		xhr.onreadystatechange = function() {
			if(xhr.readyState === xhr.DONE) {
				if(xhr.status === 200 || xhr.status === 0) {
					if(xhr.responseText) {
						if(fileType == 1) context.createModel(context.parsePDB(context, xhr.responseText, url), callback);
						else if(fileType == 0) context.sendDAT(context.parseDAT(context, xhr.responseText), callback);
						else if(fileType == 2) callback(context.parseDSSR(context, xhr.responseText));
					} else console.warn("THREE.PDBParser: [" + url + "] is unreachable or empty");
				} else console.error("THREE.PDBParser: Couldn't load [" + url +"] [" + xhr.status +"]");
			} else if(xhr.readyState == xhr.HEADERS_RECIEVED) {
				length = xhr.getResponseHeader("Content-Length");
			}
		};

		xhr.open("GET", url, true);
		if(xhr.overrideMimeType) xhr.overrideMimeType("text/plain; charset=x-user-defined");
		xhr.setRequestHeader("Content-Type", "text/plain");
		xhr.send(null);
	},

	sendDAT: function(json, callback) {
		callback(json);
	},

	parseDAT: function(context, text) {

		var lines = text.split("\n"); lines.shift();
		var bps = [];
		for(var i = 0; i < lines.length; i+= 5) {
			if(lines[i].trim() === "") continue;
			var regex = lines[i].match(/(\w+)\:\.*(\d+)/g);
			var r1 = regex[0].replace(/\.|\:/g, '');
			var r2 = regex[1].replace(/\.|\:/g, '');
			var origin = lines[i+1].trim().split(/\s+/g);
			origin = [parseFloat(origin[0]), parseFloat(origin[1]), parseFloat(origin[2])];
			var rotation = [[],[],[]];
			for(var j = 2; j < 5; j++) {
				var line = lines[i+j];
				var ln = line.trim().split(/\s+/g);
				ln = [parseFloat(ln[0]), parseFloat(ln[1]), parseFloat(ln[2])];
				rotation[j-2] = ln;
			}
			bps.push(new BasePair(r1, r2, rotation, origin));
		}

		return bps;


/*		var c1, c2, r1 = [], r2 = [];

		var i1 = text.indexOf("...    ");
		var bp1 = text.substring(text.indexOf("\n", i1) + 1, text.indexOf("...    ", i1+1)).split("\n");
		var bp2 = text.substring(text.lastIndexOf("...    ")).split("\n");
		var c1_tmp = bp1[0].trim().split(/\s+/);
		var c2_tmp = bp2[1].trim().split(/\s+/);
		c1 = [parseFloat(c1_tmp[0]), parseFloat(c1_tmp[1]), parseFloat(c1_tmp[2])];
		c2 = [parseFloat(c2_tmp[0]), parseFloat(c2_tmp[1]), parseFloat(c2_tmp[2])];

		for(var i = 0; i < 3; i++) {
			var tmp = bp1[i+1].trim().split(/\s+/);
			r1.push([parseFloat(tmp[0]), parseFloat(tmp[1]), parseFloat(tmp[2])]);
		}
		for(var i = 0; i < 3; i++) {
			var tmp = bp2[i+2].trim().split(/\s+/);
			r2.push([parseFloat(tmp[0]), parseFloat(tmp[1]), parseFloat(tmp[2])]);
		}
		var data = {"c1":c1, "r1":r1, "c2":c2, "r2":r2};
		return {"ok":true,"data": data}; */
	},

	parsePDB: function(context, text, url) {
		function createBond(model, id1, id2, type) {
			if(id2 > 0) {
				var h = "s" + Math.min(id1, id2) + "e" + Math.max(id1, id2) + "t" + type;
				if(model.bhash[h] === undefined) {
					model.bonds.push([id1, id2, type]);
					model.bhash[h] = model.bonds.length - 1;
				}
			}
		}

		function distance(atom1, atom2) {
			var a = Math.pow(Math.pow(atom1[4] - atom2[4], 2) + Math.pow(atom1[5] - atom2[5], 2) + Math.pow(atom1[6] - atom2[6], 2), 0.5);
			return a;			
		}

  		function searchAllAtoms(atoms, residueName, atomName) {
  			for(var i in atoms) {
		      if(atoms[i][3] !== residueName) continue;
		      if(atoms[i][1] === atomName) return atoms[i];
		    }
		    return null;
		 }

		 function findAtomByCoords(atoms, x, y, z) {
		 	for(var i in atoms) {
		 		if(atoms[i][4] == x && atoms[i][5] == y && atoms[i][6] == z) return atoms[i];
		 	}
		 	return null;
		 }

		var models = {}; // array of PDBModel
		var lines = text.split("\n");

		for(var i = 0; i < lines.length; i++) {
			if(lines[i].substring(0, 5) == "MODEL") {
				var id = lines[i].substring(11, 14).replace(/\s+/g, '');
				models[id] = new PDBModel(id);
			}
		}

		var currentModel = null;
		var prevResidue = null;
		var count = 0;

		var modelsSize = 0;
		for(key in models) modelsSize++;

		if(modelsSize == 0) {
			models[1] = new PDBModel(1);
			currentModel = models[1];
		}

		for(var i = 0; i < lines.length; i++) {
			if(lines[i].substring(0, 5) == "MODEL") {
				var id = lines[i].substring(11, 14).replace(/\s+/g, '');
				currentModel = models[id];
				prevResidue = null;
				count = 0;
			} else if(lines[i].substring(0, 6) == "ENDMDL") {
				currentModel = null;
			} else if(lines[i].substring(0, 4) == "ATOM" || lines[i].substring(0, 6) == "HETATM") {
				var id = parseInt(lines[i].substring(7, 11).trim()); // 1, 2, 3, 4, 5...
				var type = lines[i].substring(12, 16).toLowerCase().trim(); // c4, h5', p, o3'...
				if(type == "ho2'") type = "h2''";
				var molID = lines[i].substring(16, 21).replace(/\s+/g, '').toLowerCase(); // g, u, a, c, t
				var residue = lines[i].substring(21, 26).replace(/\s+/g, ''); // A1401, A1402, A9, B10...
				var x = parseFloat(lines[i].substring(30, 38));
				var y = parseFloat(lines[i].substring(38, 46));
				var z = parseFloat(lines[i].substring(46, 54));

				// Assume all atoms of a certain residue are in the same part of the file
				if(prevResidue !== residue) {
					currentModel.residues.push([]);
					currentModel.residueObjs.push(new Residue(molID, residue));
				}
				currentModel.residues[currentModel.residues.length - 1].push(id);
				prevResidue = residue;

				var mol = lines[i].substr(76, 2).toLowerCase().trim(); // n, h, o, c, he...
				if(mol === "") mol = lines[i].substr(12, 2).toLowerCase().trim();
				mol = mol.substring(0, 1);

				currentModel.atoms[id] = [id, type, molID, residue, x, y, z, mol, context.colors[mol], count];
				currentModel.residueObjs[currentModel.residueObjs.length - 1].atoms.push([count, type, x, y, z]);
				count++;

				if(currentModel.atommap[type] === undefined) currentModel.atommap[type] = [];
				currentModel.atommap[type].push(id);				
			} else if(lines[i].substring(0, 6) == "CONECT" && context.loadBonds) {
				var id1 = parseInt(lines[i].substr(6, 5));
				for(var m in models) {
					createBond(models[m], id1, parseInt(lines[i].substr(11, 5)), 1);
					createBond(models[m], id1, parseInt(lines[i].substr(16, 5)), 1);
					createBond(models[m], id1, parseInt(lines[i].substr(21, 5)), 1);
					createBond(models[m], id1, parseInt(lines[i].substr(26, 5)), 1);	
				}			
			}
		}

		console.log("Done Reading File...");

		if(context.createBonds) {
			for(var m in models) {
				var currentModel = models[m];

				// Inside a residue
				for(var i in currentModel.atoms) {
					var rules = null;
					if(currentModel.atoms[i][2] == 'g') rules = context.rulesG;
					else if(currentModel.atoms[i][2] == 'u') rules = context.rulesU;
					else if(currentModel.atoms[i][2] == 't') rules = context.rulesT;
					else if(currentModel.atoms[i][2] == 'a') rules = context.rulesA;
					else if(currentModel.atoms[i][2] == 'c') rules = context.rulesC;
					else if(currentModel.atoms[i][2] == 'fmn') rules = null;

					if(rules !== null && rules[currentModel.atoms[i][1]] !== undefined) {
						var rule = rules[currentModel.atoms[i][1]];
						for(var j = 0; j < rule.length; j++) {
							var bondType = 1;
							var name = rule[j];
							if(rule[j].indexOf("*") == 0) {
								bondType = 2;
								name = name.substring(1);
							}
							var list = currentModel.atommap[name];
							if(list !== undefined) {
								for(var k = 0; k < list.length; k++) {
									if(currentModel.atoms[list[k]][3] == currentModel.atoms[i][3]) {
										createBond(currentModel, i, list[k], bondType);
										break;
									}
								}
							}
						}
					}
				}

				if(url != "motifs/start/start.pdb") {

					// Backbone = type -1
					for(var i in currentModel.atoms) {
						if(currentModel.atoms[i][2] !== 'fmn' && currentModel.atoms[i][1] == "p") {
							for(var j in currentModel.atoms) {
								if( i == j || 
									currentModel.atoms[j][2] == 'fmn' || 
									currentModel.atoms[j][1] !== "o3'" || 
									currentModel.atoms[j][3] !== currentModel.atoms[i][3]) continue;
									createBond(currentModel, i, j, -1);
							}
						}
					}

					// Between residue to residue
					currentModel.residues.sort(function(r1, r2) { return currentModel.atoms[r2[0]][3] - currentModel.atoms[r1[0]][3]; });
					for(var i = 0; i < currentModel.residues.length; i++) {
						var r = currentModel.residues[i];
						var d_1 = 1000, d_2 = 1000, id_1 = -1, id_2 = -1;
						var atom_1 = null, atom_2 = null, atom_3 = null, atom_4 = null;
						for(var l = 0; l < currentModel.residues.length; l++) {
							if(l == i) continue;

							var atom1 = findAtom(currentModel.residueObjs[i], "p");
							var atom2 = findAtom(currentModel.residueObjs[i], "o3'");
							var atom3 = findAtom(currentModel.residueObjs[l], "p");
							var atom4 = findAtom(currentModel.residueObjs[l], "o3'");

							// console.log(atom1 + " " + atom2 + " " + atom3 + " " + atom4);


							/*var atom1 = currentModel.atoms[r[0]];
							var atom2 = currentModel.atoms[r[8]];
							if(i == 0 && atom1[1] !== 'p') { 
								atom1 = currentModel.atoms[r[1]];
								atom2 = currentModel.atoms[r[9]];
							}

							var atom3 = currentModel.atoms[currentModel.residues[l][0]];
							var atom4 = currentModel.atoms[currentModel.residues[l][8]];
							if(l == 0 && atom3[1] !== 'p') {
								atom3 = currentModel.atoms[currentModel.residues[l][1]];
								atom4 = currentModel.atoms[currentModel.residues[l][9]];
							}*/

							var d1 = Math.sqrt(calcDistanceSquare(atom1, atom4));
							var d2 = Math.sqrt(calcDistanceSquare(atom2, atom3));
							// console.log(d1 + " " + d2 + " " + atom1);
							if(d1 < d_1) { d_1 = d1; id_1 = l; atom_1 = atom1; atom_4 = atom4; }
							if(d2 < d_2) { d_2 = d2; id_2 = l; atom_2 = atom2; atom_3 = atom3; }
						}
						if(id_1 != -1 && d_1 < 2) {
							var atom1 = findAtomByCoords(currentModel.atoms, atom_1[2], atom_1[3], atom_1[4]); // searchAllAtoms(currentModel.atoms, currentModel.atoms[currentModel.residues[i][0]][3], "p"); // findAtom(currentModel.residueObjs[i], "p");
							var atom2 = findAtomByCoords(currentModel.atoms, atom_4[2], atom_4[3], atom_4[4]); // searchAllAtoms(currentModel.atoms, currentModel.atoms[currentModel.residues[id_1][0]][3], "o3'"); // findAtom(currentModel.residueObjs[id_1], "o3'");

							createBond(currentModel, atom1[0], atom2[0], 1);
							createBond(currentModel, atom1[0], atom2[0], -1);
							if( parseInt(atom1[3].replace(/[^\d.]/g, "")) < parseInt(atom2[3].replace(/[^\d.]/g, ""))) currentModel.sequence[atom1[3]] = [atom1[0], atom2[0]];
							else currentModel.sequence[atom2[3]] = [atom2[0], atom1[0]];
						}

						if(id_2 != -1 && d_2 < 2) {

							var atom1 = findAtomByCoords(currentModel.atoms, atom_2[2], atom_2[3], atom_2[4]); // searchAllAtoms(currentModel.atoms, currentModel.atoms[currentModel.residues[i][0]][3], "o3'"); // findAtom(currentModel.residueObjs[i], "p");
							var atom2 = findAtomByCoords(currentModel.atoms, atom_3[2], atom_3[3], atom_3[4]);
							
							createBond(currentModel, atom1[0], atom2[0], 1);
							createBond(currentModel, atom1[0], atom2[0], -1);
							if( parseInt(atom1[3].replace(/[^\d.]/g, "")) < parseInt(atom2[3].replace(/[^\d.]/g, ""))) currentModel.sequence[atom1[3]] = [atom1[0], atom2[0]];
							else currentModel.sequence[atom2[3]] = [atom2[0], atom1[0]];
						}

						/*if(id_1 != -1 && d_1 < 2) {
							var atom1 = r[0];
							var atom2 = currentModel.residues[id_1][8];
							if(i == 0 && currentModel.atoms[atom1][1] !== 'p') atom1 = r[1];
							if(id_1 == 0 && currentModel.atoms[atom2][1] !== "o3'") atom2 = currentModel.residues[id_1][9];
							createBond(currentModel, atom1, atom2, 1);
							if(parseInt(currentModel.atoms[atom1][3].replace(/[^\d.]/g, "")) < parseInt(currentModel.atoms[atom2][3].replace(/[^\d.]/g, ""))) currentModel.sequence[currentModel.atoms[atom1][3]] = [atom1, atom2];
							else currentModel.sequence[currentModel.atoms[atom2][3]] = [atom2, atom1]; // first is current atom id, second is conn atom
							createBond(currentModel, atom1, atom2, -1);
						}
						if(id_2 != -1 && d_2 < 2) {
							// change all (3) id_2 in this if to id_1 for accidental double backbone
							var atom1 = r[8];
							var atom2 = currentModel.residues[id_2][0];
							if(i == 0 && currentModel.atoms[atom1][1] !== "o3'") atom1 = r[9];
							if(id_2 == 0 && currentModel.atoms[atom2][1] !== 'p') atom2 = currentModel.residues[id_2][1];
							createBond(currentModel, atom1, atom2, 1);
							if(parseInt(currentModel.atoms[atom1][3].replace(/[^\d.]/g, "")) < parseInt(currentModel.atoms[atom2][3].replace(/[^\d.]/g, ""))) currentModel.sequence[currentModel.atoms[atom1][3]] = [atom1, atom2];
							else currentModel.sequence[currentModel.atoms[atom2][3]] = [atom2, atom1]; // first is current atom id, second is conn atom
							createBond(currentModel, atom1, atom2, -1);
						}*/
					}

					var previousRes = null;
					var sequenceStr = "";

				//	console.log(currentModel.sequence);

					for(var key in currentModel.sequence) {
						if(currentModel.sequence.hasOwnProperty(key)) {
					  		var start = currentModel.atoms[currentModel.sequence[key][0]];
					  		var end = currentModel.atoms[currentModel.sequence[key][1]];		
				//			console.log("Connection between " + start[3] + " " + end[3]);
						}
					}

					for (var key in currentModel.sequence) {
					  if (currentModel.sequence.hasOwnProperty(key)) {
					  	var start = currentModel.atoms[currentModel.sequence[key][0]];
					  	var end = currentModel.atoms[currentModel.sequence[key][1]];
					  	if(start[3] !== previousRes) sequenceStr = sequenceStr.substring(0, sequenceStr.length-1) + "|" + start[3] + ",";
					  	sequenceStr += end[3] + ",";
					  	previousRes = end[3];
					  }
					}
					currentModel.sequence = sequenceStr.substring(1, sequenceStr.length-1);
				}
			}
		}
		return {"ok": true, "models":models};
	},

	createModel: function(json, callback) {
		var models = json.models;
		var geometryAtomsArray = [];
		var geometryBondsArray = [];
		var count = 0;
		//console.log(models);
		for(var m in models) {
			var model = models[m];
			geometryBondsArray[count] = new THREE.Geometry();
			geometryAtomsArray[count] = new THREE.Geometry();

			geometryBondsArray[count].sequence = model.sequence;

			geometryAtomsArray[count].elements = []; // h he o c n
			geometryAtomsArray[count].elementTypes = []; // o3', p, ...
			geometryAtomsArray[count].residues = []; // A1401, A1402, 
			geometryAtomsArray[count].types = []; // g u a c t

			geometryAtomsArray[count].residueObjs = model.residueObjs;

			geometryBondsArray[count].types = []; // single or double
			geometryBondsArray[count].residues = []; // g u a c t
			geometryBondsArray[count].resNames = []; // A1401, A1402

			for(var i in model.atoms) {
				var pos = new THREE.Vector3(model.atoms[i][4], model.atoms[i][5], model.atoms[i][6]);
				geometryAtomsArray[count].vertices.push(pos);
				var color = new THREE.Color();
				//console.log(model.atoms[i]);
				color.setRGB(model.atoms[i][8][0]/255, model.atoms[i][8][1]/255, model.atoms[i][8][2]/255);
				
				geometryAtomsArray[count].colors.push(color);
				geometryAtomsArray[count].elements.push(model.atoms[i][7]);
				geometryAtomsArray[count].elementTypes.push(model.atoms[i][1]);
				geometryAtomsArray[count].types.push(model.atoms[i][2]);
				geometryAtomsArray[count].residues.push(model.atoms[i][3]);
			}

			for(var i = 0; i < model.bonds.length; i++) {
				geometryBondsArray[count].types.push(model.bonds[i][2]);
				geometryBondsArray[count].types.push(model.bonds[i][2]);

				geometryBondsArray[count].resNames.push(model.atoms[model.bonds[i][0]][3]);
				geometryBondsArray[count].resNames.push(model.atoms[model.bonds[i][1]][3]);

				geometryBondsArray[count].residues.push(model.atoms[model.bonds[i][0]][2]);
				geometryBondsArray[count].residues.push(model.atoms[model.bonds[i][1]][2]);

				geometryBondsArray[count].vertices.push(geometryAtomsArray[count].vertices[model.atoms[model.bonds[i][0]][9]].clone());
				geometryBondsArray[count].vertices.push(geometryAtomsArray[count].vertices[model.atoms[model.bonds[i][1]][9]].clone());
			}

			count++;
		}
		callback(geometryAtomsArray, geometryBondsArray);

	}

}