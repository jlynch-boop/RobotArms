// Robot Head Keychain - Odin's 3D Prints
// Cute simple robot head for keychain

module robot_head() {
    // Head - main box
    cube([40, 30, 20], center=false);
    
    // Left eye
    translate([10, 15, -1])
    cylinder(h=22, r=6, center=false);
    
    // Right eye
    translate([30, 15, -1])
    cylinder(h=22, r=6, center=false);
    
    // Antenna
    translate([20, 15, 20])
    cylinder(h=12, r=3, center=false);
    translate([20, 15, 32])
    sphere(r=4);
}

module keychain_hole() {
    // Keychain hole at top
    translate([20, -2, 8])
    rotate([-90, 0, 0])
    cylinder(h=8, r=3, center=false);
}

difference() {
    robot_head();
    keychain_hole();
}
