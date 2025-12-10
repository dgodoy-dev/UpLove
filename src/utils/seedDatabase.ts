import { IDatabase } from "../services/database/IDatabase";

/**
 * Seeds the database with sample data
 * Call this from within your React Native app
 */
export async function seedDatabase(db: IDatabase) {
  console.log("🌱 Starting database seeding...");

  try {
    // Create relationship
    console.log("💑 Creating relationship...");
    const name = "Sonia & Dani";
    await db.initializeRelationshipMetadata(name);
    console.log(`✓ Created relationship: ${name}`);

    // Create persons
    console.log("👤 Creating persons...");
    const person1 = await db.createPerson("Sonia");
    const person2 = await db.createPerson("Dani");
    console.log(`✓ Created persons: Sonia & Dani`);

    // Create necessities for Sonia
    console.log("💭 Creating necessities...");
    await db.createNecessity(
      person1.id,
      "Quality Time",
      "I need dedicated time together without distractions"
    );
    await db.createNecessity(
      person1.id,
      "Emotional Support",
      "I need to feel heard and understood when I share my feelings"
    );
    await db.createNecessity(
      person1.id,
      "Acts of Service",
      "Small gestures like making coffee or doing chores mean a lot to me"
    );

    // Create necessities for Dani
    await db.createNecessity(
      person2.id,
      "Physical Affection",
      "I feel loved through hugs, kisses, and physical closeness"
    );
    await db.createNecessity(
      person2.id,
      "Words of Affirmation",
      "I appreciate verbal recognition and encouragement"
    );
    await db.createNecessity(
      person2.id,
      "Independence",
      "I need space to pursue my own interests and hobbies"
    );
    console.log("✓ Created 6 necessities");

    // Create pillars
    console.log("🏛️  Creating pillars...");
    const pillar1 = await db.createPillar("Communication", "very high", 10);
    const pillar2 = await db.createPillar("Trust & Security", "very high", 5);
    const pillar3 = await db.createPillar("Physical Intimacy", "high", 8);
    const pillar4 = await db.createPillar(
      "Emotional Connection",
      "very high",
      3
    );
    const pillar5 = await db.createPillar("Fun & Adventure", "medium", 4);
    const pillar6 = await db.createPillar("Personal Growth", "medium", 1);
    console.log("✓ Created 6 pillars");

    // Create todos
    console.log("✅ Creating todos...");
    await db.createTodo("Plan a date night for this weekend", false);
    await db.createTodo("Have a conversation about future goals", false);
    await db.createTodo("Book couples massage appointment", false);
    await db.createTodo("Write appreciation notes to each other", false);
    console.log("✓ Created 4 todos");

    // Create tokeeps
    console.log("💝 Creating tokeeps...");
    await db.createToKeep("Weekly check-in conversations every Sunday", true);
    await db.createToKeep("Morning coffee together before work", true);
    await db.createToKeep("No phones during dinner time", true);
    await db.createToKeep("Monthly date nights", false);
    console.log("✓ Created 4 tokeeps");

    // Create UpLoves
    console.log("☀️  Creating daily UpLoves...");
    const pillars = await db.getAllPillars();
    const pillarIds = pillars.map((p) => p.id);

    // Sample heterogeneous lists for relationship context
    const sampleToImprove = [
      ["Communicating feelings more clearly"],
      ["Managing stress during disagreements", "Being more patient"],
      ["Balancing personal time and shared time"],
      ["Listening actively", "Avoiding phone distractions", "Showing empathy"],
      ["Keeping promises"],
    ];

    const sampleToPraise = [
      ["Being supportive this week"],
      ["Showing affection more often"],
      ["Helping with household tasks", "Showing appreciation"],
      ["Planning a nice date night"],
      ["Being emotionally available", "Encouraging my goals"],
    ];

    // Create 5 UpLoves with varied lists
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i * 3);

      await db.createUpLove(
        date,
        pillarIds,
        sampleToImprove[i],
        sampleToPraise[i]
      );
    }

    console.log("✓ Created 5 daily UpLoves");

    console.log("\n✨ Database seeding completed successfully!");
    return true;
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
}
