// Star Decoration - Odin's 3D Prints
// Simple 5-point star

module star_points(outer_r, inner_r, points, height) {
    difference() {
        union() {
            for (i = [0: points-1]) {
                angle1 = i * 360 / points;
                angle2 = (i + 0.5) * 360 / points;
                angle3 = (i + 1) * 360 / points;
                
                hull() {
                    rotate([0, 0, angle1])
                    translate([outer_r, 0, 0])
                    cylinder(h=height, r=2, center=false);
                    rotate([0, 0, angle2])
                    translate([inner_r, 0, 0])
                    cylinder(h=height, r=2, center=false);
                    rotate([0, 0, angle3])
                    translate([outer_r, 0, 0])
                    cylinder(h=height, r=2, center=false);
                }
            }
        }
        // Center hole for hanging
        cylinder(h=height+2, r=4, center=true);
    }
}

// 5 point star, 15mm thick
star_points(outer_r=40, inner_r=18, points=5, height=15);
