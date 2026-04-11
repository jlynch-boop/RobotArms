// Name Tag Plate - Odin's 3D Prints
// Simple rectangular plate for names

plate_width = 80;
plate_height = 25;
plate_depth = 4;
hole_radius = 3;

// Simple name tag with hole for keychain
difference() {
    // Main plate with rounded corners
    hull() {
        translate([5, 5, 0])
        cylinder(h=plate_depth, r=5, center=false);
        translate([plate_width-5, 5, 0])
        cylinder(h=plate_depth, r=5, center=false);
        translate([5, plate_height-5, 0])
        cylinder(h=plate_depth, r=5, center=false);
        translate([plate_width-5, plate_height-5, 0])
        cylinder(h=plate_depth, r=5, center=false);
    }
    
    // Keychain hole
    translate([8, plate_height/2, -1])
    cylinder(h=plate_depth + 2, r=hole_radius, center=false);
}
