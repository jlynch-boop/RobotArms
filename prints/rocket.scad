// Rocket Ship - Odin's 3D Prints
// Simple rocket with fins and nose cone - print ready

rocket_length = 60;
rocket_radius = 15;
fins = 3;
fin_height = 20;
fin_thickness = 3;

module fin() {
    translate([0, -fin_thickness/2, 0])
    linear_extrude(height=fin_thickness)
    polygon(points=[
        [rocket_radius, 0],
        [rocket_radius + 15, fin_height],
        [rocket_radius, fin_height * 0.8]
    ]);
}

module rocket() {
    // Main body
    cylinder(h=rocket_length * 0.65, r=rocket_radius, center=false);
    
    // Nose cone
    translate([0, 0, rocket_length * 0.65])
    cylinder(h=rocket_length * 0.35, r1=rocket_radius, r2=0, center=false);
    
    // Engine base
    translate([0, 0, -5])
    cylinder(h=5, r1=12, r2=rocket_radius, center=false);
    
    // Fins
    for (i = [0: fins-1]) {
        rotate([0, 0, i * 360 / fins])
        translate([rocket_radius - 2, 0, rocket_length * 0.15])
        fin();
    }
}

rocket();
