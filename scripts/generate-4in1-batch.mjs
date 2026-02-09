#!/usr/bin/env node
/**
 * 4-in-1 批量图片生成器
 * 
 * 策略：每次生成一张 2048×2048 的 2×2 网格图，然后用 sharp 裁切为 4 张独立图片。
 * 每张最终图片转为 WebP 格式。
 * 
 * 成本节省：原需 N 次 API 调用 → 现只需 N/4 次，节省 75%。
 * 
 * 用法：
 *   node scripts/generate-4in1-batch.mjs [--lesson 5] [--dry-run]
 *   不带参数：生成所有 L5-L20 缺失的图片
 *   --lesson N：只生成第 N 课
 *   --dry-run：不调用 API，只打印计划
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

// ━━━ API 配置 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const API_URL = 'https://api.apiyi.com/v1/images/generations';
const API_KEY = '***REMOVED***';
const MODEL = 'seedream-4-5-251128';
const SIZE = '2048x2048';
const CONCURRENCY = 2;
const BATCH_DELAY = 2000;

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'images', 'lessons');
const GRID_DIR = path.join(OUTPUT_DIR, 'grids');

if (!fs.existsSync(GRID_DIR)) fs.mkdirSync(GRID_DIR, { recursive: true });

const STYLE = ', dark executive boardroom aesthetic, deep black and gold color palette, professional business illustration, cinematic lighting, ultra high quality, no text overlay, no watermark';

// ━━━ L5-L20 图片 Prompt 定义 ━━━━━━━━━━━━━━━━━━━━
// 每个 grid = 4 张图片。每课分成多个 grid。
// grid id: l5_g1 → 裁切后 → l5_01, l5_02, l5_03, l5_04

const LESSONS = {
    5: {
        title: '需求与界面 (Layer 1&2)',
        grids: [
            {
                id: 'l5_g1', prompts: [
                    'Executive overwhelmed by fragmented project requirements on messy whiteboard',
                    'Digital transformation blueprint glowing on glass wall, UI wireframes',
                    'Failed app project shown as error screens on multiple devices',
                    'Business owner trying to explain ideas to confused developer team'
                ]
            },
            {
                id: 'l5_g2', prompts: [
                    'Hotel front desk as metaphor for user interface, golden concierge',
                    'Drag-and-drop website builder holographic interface',
                    'Beautiful AI-generated business website on premium laptop screen',
                    'Before-after comparison: ugly amateur vs AI-designed professional website'
                ]
            },
            {
                id: 'l5_g3', prompts: [
                    'System architecture builder game interface with golden building blocks',
                    'Five-layer pyramid structure with layer 1 and 2 highlighted in gold',
                    'Jewelry brand website transformation: old static vs new AI-powered dynamic',
                    'Mobile phone showing real-time chat widget on brand website'
                ]
            },
            {
                id: 'l5_g4', prompts: [
                    'Customer engagement dashboard showing live chat metrics and conversion',
                    'Young entrepreneur excited looking at analytics growth charts on screen',
                    'Modular UI component library floating in dark space like golden cards',
                    'Premium website award badge and completion milestone golden seal'
                ]
            },
            {
                id: 'l5_g5', prompts: [
                    'Blueprint paper transforming into digital UI wireframes holographically',
                    'Designer hand sketching UI on tablet with AI auto-completing the design',
                    'Comparison of 3 website layouts on monitors in dark office',
                    'Golden pixel grid assembling into a complete webpage, construction metaphor'
                ]
            },
            {
                id: 'l5_g6', prompts: [
                    'Modern responsive design displaying across phone, tablet, desktop devices',
                    'Meeting room with stakeholders reviewing new AI website on big screen',
                    'Website performance dashboard with all green metrics glowing gold',
                    'Elegant golden bridge connecting requirement document to finished product'
                ]
            },
            {
                id: 'l5_g7', prompts: [
                    'Hand clicking deploy button on sleek dark dashboard interface',
                    'Live website going live with golden particle celebration effect',
                    'Side-by-side cost comparison: traditional dev team vs AI development',
                    'Module 2 Layer 1-2 completion emblem, golden architectural milestone'
                ]
            },
        ]
    },
    6: {
        title: '接入大脑 API (Layer 3)',
        grids: [
            {
                id: 'l6_g1', prompts: [
                    'Beautiful but silent storefront website that cannot respond to visitors',
                    'Robot brain being connected via golden cables to a website backend',
                    'API connection visualization: golden data stream from cloud to device',
                    'Chat interface before and after AI connection: static vs interactive'
                ]
            },
            {
                id: 'l6_g2', prompts: [
                    'Three API pricing tiers displayed as bronze, silver, gold packages',
                    'Cost calculator holographic interface showing per-token pricing',
                    'Fortune 500 company logos connected by API golden threads to AI cloud',
                    'Developer dashboard showing API key management and usage stats'
                ]
            },
            {
                id: 'l6_g3', prompts: [
                    'ROI calculator game interface with sliders for monthly queries and costs',
                    'Comparison chart: hiring customer service staff vs AI API cost',
                    'Smart chatbot answering customer questions on jewelry website at night',
                    'Data flow diagram: user question travels through API to AI brain and back'
                ]
            },
            {
                id: 'l6_g4', prompts: [
                    'Real-time chat conversation between customer and AI on phone screen',
                    'Monthly cost breakdown infographic: pennies per conversation in gold',
                    'Business owner sleeping peacefully while AI handles midnight customers',
                    'API layer completion badge, golden brain connected to network nodes'
                ]
            },
            {
                id: 'l6_g5', prompts: [
                    'Multiple AI model logos as chess pieces on strategic board',
                    'Failover system visualization with primary and backup AI providers',
                    'Speed benchmark test results displayed on racing track metaphor',
                    'Security shield protecting API keys and data flow in golden vault'
                ]
            },
            {
                id: 'l6_g6', prompts: [
                    'Manufacturing control room integrating AI analytics via API dashboard',
                    'Customer journey map from website visit to AI chat to purchase',
                    'Webhook notification system sending golden alerts to business owner phone',
                    'API rate limiting visualization with golden traffic light system'
                ]
            },
            {
                id: 'l6_g7', prompts: [
                    'Celebrating successful first API call with golden data particles',
                    'Before-after business metrics: pre-API vs post-API improvement chart',
                    'Layer 3 API completion milestone emblem with connected network design',
                    'Bridge connecting Layer 2 UI to Layer 4 Skills with API in between'
                ]
            },
        ]
    },
    7: {
        title: '技能包 Skills (Layer 4)',
        grids: [
            {
                id: 'l7_g1', prompts: [
                    'AI giving wrong industry-specific answer, confused business owner face',
                    'Generic chatbot hallucinating incorrect product specs on screen',
                    'Library of domain knowledge books transforming into digital data cards',
                    'Injection syringe metaphor: injecting expertise into AI brain golden glow'
                ]
            },
            {
                id: 'l7_g2', prompts: [
                    'RAG retrieval augmented generation process: documents being indexed',
                    'Knowledge base dashboard with organized industry documents and FAQs',
                    'AI reading company handbook and product catalog at golden desk',
                    'Before-after accuracy: random guessing vs knowledge-enhanced precision'
                ]
            },
            {
                id: 'l7_g3', prompts: [
                    'Decision matrix game interface with criteria and scoring sliders',
                    'Skills configuration panel: toggle switches for different knowledge modules',
                    'Real estate company AI knowing exact floor plans and pricing details',
                    'Customer amazed by AI knowing specific product details instantly'
                ]
            },
            {
                id: 'l7_g4', prompts: [
                    'Knowledge update pipeline: new products auto-synced to AI golden conveyor',
                    'Quality control dashboard showing AI accuracy metrics improving over time',
                    'Layer 4 Skills completion badge with golden book and brain icon',
                    'Transition scene: from knowledge to data layer connection bridge'
                ]
            },
            {
                id: 'l7_g5', prompts: [
                    'Document ingestion pipeline consuming PDFs and web pages into AI system',
                    'Vector database visualization: text chunks mapped as golden points in space',
                    'Semantic search results highlighted with golden relevancy scoring',
                    'Admin panel for managing and updating knowledge base content'
                ]
            },
            {
                id: 'l7_g6', prompts: [
                    'Multi-language knowledge base serving global customers simultaneously',
                    'Industry expert reviewing and curating AI knowledge base quality',
                    'Version control for knowledge: old info fading, new info highlighted gold',
                    'Skills layer ROI infographic: accuracy improvement and customer satisfaction'
                ]
            },
            {
                id: 'l7_g7', prompts: [
                    'Complete AI assistant equipped with full industry knowledge toolbelt',
                    'Customer feedback loop: positive reviews flowing back to improve knowledge',
                    'Skills mastery achievement seal with golden certification ribbon',
                    'Pathway from Layer 4 to Layer 5 MCP data connection golden arrow'
                ]
            },
        ]
    },
    8: {
        title: '数据连接 MCP (Layer 5)',
        grids: [
            {
                id: 'l8_g1', prompts: [
                    'AI in isolation bubble unable to access real business data systems',
                    'Broken bridge between AI brain and company ERP/CRM databases',
                    'Factory owner frustrated AI cannot check real inventory or orders',
                    'Data silos visualized as separate golden vault rooms not connected'
                ]
            },
            {
                id: 'l8_g2', prompts: [
                    'Universal USB-C adapter metaphor glowing gold connecting multiple systems',
                    'MCP protocol hub connecting CRM, ERP, calendar, email into single node',
                    'Real-time stock check: AI pulling live inventory count from database',
                    'Automated email: AI composing and sending order confirmation via MCP'
                ]
            },
            {
                id: 'l8_g3', prompts: [
                    'Architecture builder game showing MCP connections as golden pipes',
                    'Five layer pyramid fully assembled with MCP as crown layer glowing gold',
                    'AI executing real business action: booking meeting via calendar API',
                    'Dashboard showing all connected data sources with green status indicators'
                ]
            },
            {
                id: 'l8_g4', prompts: [
                    'Before-after: manual data entry vs AI auto-syncing across systems',
                    'One person commanding entire business through AI connected dashboard',
                    'MCP security shield: data access permissions and audit trail golden lock',
                    'Five layer completion celebration: full pyramid assembled with all layers'
                ]
            },
            {
                id: 'l8_g5', prompts: [
                    'AI pulling real-time shipping tracking data and auto-notifying customers',
                    'Cross-platform data synchronization visualization with golden data streams',
                    'Factory production line controlled by AI through MCP connection dashboard',
                    'Integration status dashboard showing all systems connected and healthy'
                ]
            },
            {
                id: 'l8_g6', prompts: [
                    'Workflow automation: AI triggering actions across multiple business systems',
                    'Real-time business intelligence: AI aggregating data from all sources',
                    'Security audit trail showing all AI data access logged in golden journal',
                    'MCP data layer achievement badge with connected nodes golden design'
                ]
            },
            {
                id: 'l8_g7', prompts: [
                    'Complete five-layer AI application architecture glowing in dark space',
                    'Executive standing before holographic command center controlling AI army',
                    'Module 2 graduation milestone: all 5 layers mastered golden emblem',
                    'Transition bridge from theory Module 2 to hands-on Module 3'
                ]
            },
        ]
    },
    9: {
        title: '智能品牌官网',
        grids: [
            {
                id: 'l9_g1', prompts: [
                    'Jewelry store owner staring at outdated static website with frustration',
                    'Competitor websites displayed on screens, all looking modern and dynamic',
                    'Price tag showing web development quote: 100K RMB traditional cost',
                    'Meeting with web developer going wrong, misunderstanding requirements'
                ]
            },
            {
                id: 'l9_g2', prompts: [
                    'AI cursor autonomously building website in seconds, code flying',
                    'Professional jewelry brand website born on screen, black and gold theme',
                    'Mobile version of website auto-adapting perfectly on smartphone',
                    'AI chatbot embedded in website greeting visitors intelligently'
                ]
            },
            {
                id: 'l9_g3', prompts: [
                    'ROI calculator for website project showing cost savings analysis',
                    'Split screen: 3-month traditional vs 3-day AI website development timeline',
                    'Real visitor engaging with AI chatbot on jewelry website, buying jewelry',
                    'Analytics dashboard showing website traffic and conversion metrics'
                ]
            },
            {
                id: 'l9_g4', prompts: [
                    'Customer testimonial bubble praising AI-assisted shopping experience',
                    'Website performance metrics: load speed, SEO score, user engagement',
                    'Owner managing website content through simple AI-powered admin panel',
                    'Project completion: beautiful jewelry website live on premium laptop'
                ]
            },
            {
                id: 'l9_g5', prompts: [
                    'SEO optimization visualization: keywords ranked high on search engine',
                    'Multi-device responsive design: desktop, tablet, phone all perfect',
                    'E-commerce integration: payment system connected to AI website',
                    'Social media icons linked to website creating golden traffic flow'
                ]
            },
            {
                id: 'l9_g6', prompts: [
                    'Content management: AI auto-generating product descriptions from photos',
                    'A/B testing interface showing two homepage designs with golden metrics',
                    'Website analytics weekly report auto-generated by AI on executive desk',
                    'Customer journey visualization from ad click to website to purchase'
                ]
            },
            {
                id: 'l9_g7', prompts: [
                    'Night scene: AI website serving customers while owner sleeps peacefully',
                    'Revenue growth chart attributed to new AI website launch',
                    'Workshop 1 completion badge: smart brand website mastery golden seal',
                    'Transition to next project: dashboard building tools appearing on desk'
                ]
            },
        ]
    },
    10: {
        title: '智能商业看板',
        grids: [
            {
                id: 'l10_g1', prompts: [
                    'Restaurant chain owner drowning in Excel spreadsheets and paper reports',
                    'Multiple disconnected screens showing fragmented business data chaos',
                    'Monthly financial report arriving too late, decisions already missed',
                    'Competitor using real-time dashboard while protagonist uses paper'
                ]
            },
            {
                id: 'l10_g2', prompts: [
                    'Beautiful AI-powered business dashboard appearing on big screen in dark room',
                    'Real-time KPI cards glowing gold: revenue, cost, profit, headcount metrics',
                    'Dashboard drill-down: tapping a card reveals detailed golden analytics',
                    'Mobile dashboard showing alerts and real-time metrics on phone'
                ]
            },
            {
                id: 'l10_g3', prompts: [
                    'Case analyzer game showing restaurant chain data analysis interface',
                    'Multi-store comparison chart with bars in gold and dark theme',
                    'Anomaly detection: AI highlighting suspicious cost spike in red gold glow',
                    'Predictive analytics: forecasting next month revenue with confidence band'
                ]
            },
            {
                id: 'l10_g4', prompts: [
                    'Morning briefing: AI dashboard summarizing yesterday key numbers to owner',
                    'Decision tree: AI suggesting action items based on dashboard insights',
                    'Weekly trend chart showing all stores performance side by side',
                    'Alert system: phone notification about unusual business metric change'
                ]
            },
            {
                id: 'l10_g5', prompts: [
                    'Data integration: POS, HR, supply chain all feeding into central dashboard',
                    'Custom report builder: dragging golden widgets to create personalized view',
                    'Team access: different dashboard views for GM, finance, operations roles',
                    'Historical data trends revealing seasonal patterns with golden data lines'
                ]
            },
            {
                id: 'l10_g6', prompts: [
                    'Real-time map showing all store locations with performance color coding',
                    'Automated monthly report PDF being generated and emailed by AI assistant',
                    'Dashboard ROI visualization: time saved vs traditional reporting methods',
                    'Connected ecosystem: dashboard feeding insights to other AI systems'
                ]
            },
            {
                id: 'l10_g7', prompts: [
                    'Owner making confident decision in boardroom backed by real-time data',
                    'Workshop 2 completion celebration: data-driven management mastered',
                    'Smart dashboard project completion badge golden data visualization seal',
                    'Transition bridge to next project: AI customer service agent appearing'
                ]
            },
        ]
    },
    11: {
        title: '7×24 AI 员工',
        grids: [
            {
                id: 'l11_g1', prompts: [
                    'Customer service team burned out at call center, midnight shift exhausted',
                    'Missed customer calls at 2AM shown on phone with growing complaint count',
                    'Comparison: human CS agent sleeping vs AI agent active at midnight',
                    'Customer rage review online about unresponsive weekend customer service'
                ]
            },
            {
                id: 'l11_g2', prompts: [
                    'Friendly AI customer service avatar on chat interface, golden glow',
                    'AI handling multiple customer conversations simultaneously on dashboard',
                    'Seamless handoff: AI escalating complex issue to human agent smoothly',
                    'Knowledge base powering AI responses with industry-specific expertise'
                ]
            },
            {
                id: 'l11_g3', prompts: [
                    'ROI calculator for AI customer service vs human agent cost comparison',
                    'AI resolving common FAQ questions instantly with high satisfaction rate',
                    'Training interface: teaching AI about new products and policies',
                    'Customer satisfaction survey showing dramatic improvement after AI CS'
                ]
            },
            {
                id: 'l11_g4', prompts: [
                    'Multi-channel support: AI responding on WeChat, website, phone, email',
                    'Quality monitoring dashboard: AI response accuracy and tone metrics',
                    'Night shift AI agent handling orders while physical store is closed',
                    'Revenue attribution: sales generated by AI agent during off-hours'
                ]
            },
            {
                id: 'l11_g5', prompts: [
                    'Emotional intelligence: AI detecting upset customer and adjusting tone',
                    'Language barrier broken: AI serving customers in multiple languages',
                    'Proactive outreach: AI following up with customers after service interaction',
                    'Compliance check: AI ensuring all responses meet regulatory requirements'
                ]
            },
            {
                id: 'l11_g6', prompts: [
                    'Team restructure: CS staff moving to creative roles while AI handles routine',
                    'Monthly report: AI saved X hours and handled Y thousand conversations',
                    'VIP customer recognition: AI personalizing service based on history',
                    'Integration with CRM: AI logging all interactions for sales follow-up'
                ]
            },
            {
                id: 'l11_g7', prompts: [
                    'Business owner reviewing AI performance dashboard with smile at sunset',
                    'Workshop 3 completion: 24/7 AI customer service deployed badge',
                    'AI employee achievement seal with clock showing round-the-clock service',
                    'Transition to next project: smart scheduling system tools appearing'
                ]
            },
        ]
    },
    12: {
        title: '智能排产系统',
        grids: [
            {
                id: 'l12_g1', prompts: [
                    'Factory floor chaos: production line stopped, workers arguing about schedule',
                    'Whiteboard with messy handwritten production schedule covered in corrections',
                    'Order deadline alerts flashing red on multiple screens in factory office',
                    'Factory owner stressed on phone explaining delivery delay to angry client'
                ]
            },
            {
                id: 'l12_g2', prompts: [
                    'AI scheduling dashboard showing optimized production plan in golden timeline',
                    'Gantt chart styled production schedule auto-generated by AI system',
                    'Real-time factory floor monitoring with IoT sensors feeding AI dashboard',
                    'Material requirements auto-calculated by AI based on order pipeline'
                ]
            },
            {
                id: 'l12_g3', prompts: [
                    'Architecture builder game interface for factory AI system configuration',
                    'Production efficiency comparison: before and after AI scheduling chart',
                    'Emergency rescheduling: AI instantly recalculating when machine breaks down',
                    'Worker assignment optimization: AI matching skills to production tasks'
                ]
            },
            {
                id: 'l12_g4', prompts: [
                    'Supply chain integration: AI coordinating suppliers with production schedule',
                    'Quality control checkpoints automated in AI production workflow',
                    'Factory KPI dashboard: utilization rate, OEE, on-time delivery metrics',
                    'Module 3 completion celebration: 4 projects built hands-on golden badge'
                ]
            },
            {
                id: 'l12_g5', prompts: [
                    'Predictive maintenance: AI warning about machine failure before it happens',
                    'Energy optimization: AI scheduling production during off-peak electricity',
                    'Multi-factory coordination: AI balancing workload across production sites',
                    'Digital twin: virtual factory replica predicting outcomes before execution'
                ]
            },
            {
                id: 'l12_g6', prompts: [
                    'Automated reporting: daily production summary delivered to owner smartphone',
                    'Inventory optimization: just-in-time delivery triggered by AI prediction',
                    'Compliance tracking: AI ensuring safety standards met during production',
                    'Cost analysis breakdown: identifying waste points in production pipeline'
                ]
            },
            {
                id: 'l12_g7', prompts: [
                    'Smooth factory operation: all production lines running optimally green status',
                    'Module 3 graduation: four practical projects completed golden certificate',
                    'Smart factory achievement seal with cog wheels and AI brain emblem',
                    'Transition to Module 4: workshop tools collection appearing in golden light'
                ]
            },
        ]
    },
    13: {
        title: 'AI 图片加工厂',
        grids: [
            {
                id: 'l13_g1', prompts: [
                    'E-commerce product photographer overwhelmed by thousands of SKU photos',
                    'Before-after product photo: amateur vs AI-enhanced professional quality',
                    'Conveyor belt of product images being enhanced by AI processing stations',
                    'Cost comparison board: hiring photographer team vs AI image processing'
                ]
            },
            {
                id: 'l13_g2', prompts: [
                    'AI model comparison interface showing same image processed by different AIs',
                    'Background removal: product extracted from messy background to clean white',
                    'Style transfer: same product in different visual styles for different platforms',
                    'Batch processing dashboard: hundreds of images being processed simultaneously'
                ]
            },
            {
                id: 'l13_g3', prompts: [
                    'Virtual model wearing clothing generated by AI without actual photoshoot',
                    'Product scene generation: item placed in lifestyle context by AI compositing',
                    'Quality control panel: AI checking image resolution and composition',
                    'Output folder showing perfectly formatted images for Taobao, JD, Douyin'
                ]
            },
            {
                id: 'l13_g4', prompts: [
                    'Before-after metrics: photography timelines and costs dramatically reduced',
                    'Happy e-commerce owner viewing AI-processed product gallery on laptop',
                    'Workshop 1 completion: AI image factory mastery golden seal',
                    'AI camera lens with golden glow processing pixels into perfect products'
                ]
            },
            {
                id: 'l13_g5', prompts: [
                    'Color correction: AI normalizing white balance across product photo series',
                    'Size standardization: AI cropping and resizing for different platform specs',
                    'Watermark generation: AI adding branded watermarks to product images',
                    'Training data: teaching AI brand-specific photo style and preferences'
                ]
            },
            {
                id: 'l13_g6', prompts: [
                    'Seasonal campaign: AI generating holiday-themed product backgrounds',
                    'A/B testing: two product photo styles with engagement metrics compared',
                    'Integration with e-commerce platform: auto-upload processed images',
                    'Monthly savings report: image processing cost reduction golden chart'
                ]
            },
        ]
    },
    14: {
        title: 'AI 标书工匠',
        grids: [
            {
                id: 'l14_g1', prompts: [
                    'Bid proposal team working overtime, stacks of paper documents everywhere',
                    'Clock showing deadline pressure with half-finished bid document on desk',
                    'Collection of past winning bids organized in golden filing system',
                    'AI analyzing bid requirements and matching with company capabilities'
                ]
            },
            {
                id: 'l14_g2', prompts: [
                    'AI auto-generating bid proposal sections from template library',
                    'Comparison view: manually written vs AI-refined proposal sections',
                    'Compliance checker: AI scanning requirements list with golden checkmarks',
                    'Pricing optimizer: AI recommending competitive bid price based on analysis'
                ]
            },
            {
                id: 'l14_g3', prompts: [
                    'Case analyzer game showing bid success factors analysis interface',
                    'Win rate improvement chart: before and after AI bid preparation',
                    'Team collaboration: AI drafting while human expert reviews and refines',
                    'Submission dashboard: tracking multiple active bids status golden cards'
                ]
            },
            {
                id: 'l14_g4', prompts: [
                    'Winning notification arriving on phone with celebration golden particles',
                    'ROI of AI bidding: time saved and win rate improved infographic',
                    'Workshop 2 completion: AI bid craftsman mastery golden seal',
                    'Bid proposal transforming from rough draft to polished document by AI'
                ]
            },
            {
                id: 'l14_g5', prompts: [
                    'Risk assessment: AI flagging potential issues in bid proposal red warnings',
                    'Technical writing: AI polishing language while maintaining accuracy',
                    'Reference matching: AI pulling relevant case studies for bid support',
                    'Deadline countdown with AI completing all sections in parallel'
                ]
            },
            {
                id: 'l14_g6', prompts: [
                    'Post-bid analysis: AI reviewing why bids won or lost for improvement',
                    'Template library growing: each completed bid enriching AI knowledge',
                    'Multi-project bidding: AI managing several simultaneous bid deadlines',
                    'Client meeting preparation: AI generating presentation from bid content'
                ]
            },
        ]
    },
    15: {
        title: 'OpenClaw 指挥官',
        grids: [
            {
                id: 'l15_g1', prompts: [
                    'Construction site chaos: 8 WeChat groups with thousands of messages flooding',
                    'Project manager arguing in group chat, blame-shifting between contractors',
                    'Missed deadline notification on phone with angry client complaint',
                    'Traditional project tracking: messy spreadsheet with outdated status'
                ]
            },
            {
                id: 'l15_g2', prompts: [
                    'AI agent silently monitoring group chat, extracting commitments highlighted',
                    'Automated reminder notification: task deadline approaching for contractor',
                    'Evidence trail: AI-logged conversation history with timestamped promises',
                    'Weekly progress report auto-generated by AI agent on executive screen'
                ]
            },
            {
                id: 'l15_g3', prompts: [
                    'Timeline explorer game showing project milestones and delays visualization',
                    'Before/after comparison: chaotic vs organized project management timeline',
                    'AI agent dashboard showing 8 construction sites managed simultaneously',
                    'Delay risk indicator: early warning system highlighting potential issues'
                ]
            },
            {
                id: 'l15_g4', prompts: [
                    'All 8 projects completed on time, green checkmarks across dashboard',
                    'Customer satisfaction improvement chart after AI project management',
                    'Workshop 3 completion: OpenClaw commander mastery golden seal',
                    'AI agent distinguished from chatbot: proactive vs reactive comparison'
                ]
            },
            {
                id: 'l15_g5', prompts: [
                    'Multi-stakeholder coordination: AI tracking commitments across parties',
                    'Escalation pathway: AI identifying and flagging issues to manager',
                    'Meeting minutes auto-generated from group chat discussions by AI',
                    'Resource allocation optimization based on AI analysis of workload'
                ]
            },
            {
                id: 'l15_g6', prompts: [
                    'Cross-project dependency tracking: AI mapping relationships between tasks',
                    'Performance analytics: contractor reliability scores compiled by AI',
                    'Template project plan: AI generating standard timelines from past projects',
                    'Communication efficiency metrics: reduced message volume with AI summary'
                ]
            },
        ]
    },
    16: {
        title: 'AI 内容矩阵',
        grids: [
            {
                id: 'l16_g1', prompts: [
                    'Social media manager overwhelmed managing 5 platforms simultaneously',
                    'Content calendar with too many empty slots showing gaps in publishing',
                    'Cost breakdown: hiring content team of 3 people annual salary 800K RMB',
                    'Same product selling point written in 5 different platform styles'
                ]
            },
            {
                id: 'l16_g2', prompts: [
                    'Prompt template library: different templates for Douyin, Xiaohongshu, WeChat',
                    'Content generation pipeline: one idea splitting into 5 platform versions',
                    'AI-generated social media images for product marketing campaigns',
                    'Content scheduling dashboard with golden timeline and publish slots'
                ]
            },
            {
                id: 'l16_g3', prompts: [
                    'Prompt workshop game interface for platform-specific content writing',
                    'Xiaohongshu style post generated by AI with emojis and hashtags visible',
                    'Douyin script storyboard auto-generated by AI in 15-second format',
                    'Content performance analytics across all 5 platforms in unified dashboard'
                ]
            },
            {
                id: 'l16_g4', prompts: [
                    'One person managing entire content empire from single AI command center',
                    'Monthly output comparison: 20 posts manually vs 200 posts with AI',
                    'Workshop 4 completion: AI content matrix mastery golden seal',
                    'Content factory assembly line metaphor with golden conveyor belt'
                ]
            },
            {
                id: 'l16_g5', prompts: [
                    'Brand voice consistency: AI maintaining same tone across all platforms',
                    'Trending topic detection: AI suggesting content based on hot keywords',
                    'User engagement metrics: comments and shares growth chart post AI content',
                    'Competitor content analysis: AI benchmarking against industry leaders'
                ]
            },
            {
                id: 'l16_g6', prompts: [
                    'Cross-platform repurposing: long article becoming video script and infographic',
                    'Content approval workflow: AI draft to human review to publish pipeline',
                    'SEO optimization: AI enhancing content for search engine visibility',
                    'Image plus text: AI matching generated images with written content'
                ]
            },
        ]
    },
    17: {
        title: 'AI 经营分析',
        grids: [
            {
                id: 'l17_g1', prompts: [
                    'Restaurant owner staring at confusing Excel spreadsheet not understanding data',
                    'IT department overwhelmed with data export requests from management',
                    'Traditional BI tool with steep learning curve scaring business owner',
                    'Question bubble: Why did we lose money yesterday? floating in dark room'
                ]
            },
            {
                id: 'l17_g2', prompts: [
                    'Text-to-SQL visualization: natural language transforming into database query',
                    'AI answering business question with clear explanation and data chart',
                    'Real-time data dashboard responding to verbal questions from owner',
                    'Comparison: 2-day manual analysis vs 3-second AI instant answer'
                ]
            },
            {
                id: 'l17_g3', prompts: [
                    'Decision matrix game interface for choosing analytics tool',
                    'Multi-store performance comparison chart auto-generated by AI query',
                    'Predictive analytics: AI forecasting next month trends with golden line',
                    'Natural language conversation with database shown on dark chat interface'
                ]
            },
            {
                id: 'l17_g4', prompts: [
                    'Business owner making confident decisions backed by real-time AI insights',
                    'Data democracy visualization: everyone has access to analytics not just IT',
                    'Workshop 5 completion: AI business analytics mastery golden seal',
                    'From data worker to decision commander transformation visualization'
                ]
            },
            {
                id: 'l17_g5', prompts: [
                    'Anomaly detection: AI alert about unusual business metric change red gold',
                    'Root cause analysis: AI drilling into data to explain why a metric changed',
                    'Automated weekly business review report delivered to email and phone',
                    'Cross-departmental insights: AI connecting finance, ops, sales data'
                ]
            },
            {
                id: 'l17_g6', prompts: [
                    'Goal tracking: AI dashboards showing progress toward quarterly targets',
                    'What-if scenarios: AI modeling business outcomes of different strategies',
                    'Benchmarking: comparing own metrics against industry golden standards',
                    'Data-driven culture: entire management team using AI analytics daily'
                ]
            },
        ]
    },
    18: {
        title: '销售供应链闭环',
        grids: [
            {
                id: 'l18_g1', prompts: [
                    'Factory sales team frustrated: have orders but no inventory available',
                    'Production line idle while warehouse full of wrong products unsold',
                    'Invisible wall between sales department and production department',
                    'Inventory cost clock ticking: money wasted on sitting unsold goods'
                ]
            },
            {
                id: 'l18_g2', prompts: [
                    'MCP connecting ERP, CRM, production system with golden data streams',
                    'AI dashboard showing real-time production capacity to sales team',
                    'Smart matching: AI pairing incoming orders with available production slots',
                    'Incentive notification: AI telling sales which products to push this week'
                ]
            },
            {
                id: 'l18_g3', prompts: [
                    'ROI calculator game interface for supply chain optimization savings',
                    'Inventory turnover improvement chart: 45 days dropping to 22 days golden',
                    'On-time delivery rate climbing from 78% to 96% on progress meter',
                    'Annual savings infographic: 1.49 million RMB saved through AI integration'
                ]
            },
            {
                id: 'l18_g4', prompts: [
                    'Six workshop weapons displayed as golden arsenal on dark display wall',
                    'Module 4 completion celebration: all 6 workshops mastered golden badge',
                    'Factory and sales team united through AI data bridge golden handshake',
                    'Transition to Module 5 Strategic: from tools to strategy golden staircase'
                ]
            },
            {
                id: 'l18_g5', prompts: [
                    'Demand forecasting: AI predicting sales trends to guide production planning',
                    'Supplier management: AI scoring and recommending suppliers based on data',
                    'Cash flow optimization: reduced inventory freeing up working capital',
                    'End-to-end visibility: entire supply chain monitored in single dashboard'
                ]
            },
            {
                id: 'l18_g6', prompts: [
                    'Production scheduling optimization: AI minimizing changeover downtime',
                    'Quality-cost-delivery triangle balanced by AI supply chain management',
                    'Sales-production weekly sync automated by AI with action items',
                    'Complete closed loop: order to production to delivery to cash glass flow'
                ]
            },
        ]
    },
    19: {
        title: '回公司怎么落地',
        grids: [
            {
                id: 'l19_g1', prompts: [
                    'Executive returning to office after AI course, looking at team uncertainly',
                    'Employee worried faces: Will AI replace us? fear bubbles floating',
                    'Failed AI initiative graveyard: abandoned projects with red X marks',
                    'Four-step golden staircase: Audit, Evaluate, Pilot, Scale'
                ]
            },
            {
                id: 'l19_g2', prompts: [
                    'Audit process: magnifying glass examining repetitive work tasks in golden glow',
                    'Evaluation matrix: scoring AI opportunity for each business pain point',
                    'Pilot project launch: small team successfully running first AI use case',
                    'Scaling success: results spreading from pilot team to other departments'
                ]
            },
            {
                id: 'l19_g3', prompts: [
                    'Decision matrix game interface for prioritizing AI implementation projects',
                    'Customer service automation card ranked highest with golden score',
                    'Small wins celebration: first AI project saving money with chart proof',
                    'Growth strategy: reinvesting AI savings into next AI project golden cycle'
                ]
            },
            {
                id: 'l19_g4', prompts: [
                    'CEO presenting AI results to board with data-backed confidence',
                    'AI opportunity map: company processes mapped with AI potential scores',
                    'Change management: training team to work WITH AI not against it',
                    'Strategic vision: from single AI tool to company-wide AI transformation'
                ]
            },
            {
                id: 'l19_g5', prompts: [
                    'Implementation timeline: 30-60-90 day plan for AI rollout',
                    'Budget allocation: starting small and scaling with proven ROI',
                    'Stakeholder alignment meeting with clear AI roadmap presented',
                    'Risk mitigation: parallel running old and new systems during transition'
                ]
            },
            {
                id: 'l19_g6', prompts: [
                    'Success metrics dashboard: tracking AI implementation KPIs',
                    'Best practice sharing: internal AI champion training program',
                    'Strategic lesson complete: implementation playbook ready golden seal',
                    'Bridge to final lesson: graduation podium appearing in golden spotlight'
                ]
            },
        ]
    },
    20: {
        title: '毕业路演',
        grids: [
            {
                id: 'l20_g1', prompts: [
                    'Grand stage with golden spotlight for graduation ceremony',
                    'Timeline of 20 lessons displayed as golden milestone markers on path',
                    'Five modules visualized as golden trophies: cognition, blocks, building, workshops, strategy',
                    'Student portfolio: all projects built during the course displayed proudly'
                ]
            },
            {
                id: 'l20_g2', prompts: [
                    'Exponential AI growth curve visualization for future trends',
                    'Human and AI collaboration: person directing team of AI agents in golden command center',
                    'Speed advantage: first mover capturing market opportunity golden trophy',
                    'Future vision: AI-powered company operating smoothly with minimal staff'
                ]
            },
            {
                id: 'l20_g3', prompts: [
                    'Golden AI Commander certification badge floating in dark space elegant design',
                    'Graduation celebration: confetti and golden particles around achievement emblem',
                    'Executive standing at summit overlooking AI-powered business landscape below',
                    'Course complete: golden seal with 20 lessons, 4 projects, 6 workshops achievement'
                ]
            },
            {
                id: 'l20_g4', prompts: [
                    'Door opening to bright AI future: businessman stepping into glowing golden light',
                    'Executive superhero silhouette commanding AI army from rooftop',
                    'Thank you card design: elegant dark gold congratulations minimal style',
                    'Final logo: AI Survival Course graduation complete golden laurel wreath'
                ]
            },
        ]
    },
};

// ━━━ 生成逻辑 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function generateGridImage(gridId, prompts) {
    const gridPath = path.join(GRID_DIR, `${gridId}.jpg`);

    // 检查裁切后的 4 张 webp 是否已全部存在
    const baseLesson = gridId.split('_g')[0]; // e.g. "l5"
    const gridNum = parseInt(gridId.split('_g')[1]); // e.g. 1
    const startIdx = (gridNum - 1) * 4 + 1;
    const allExist = [0, 1, 2, 3].every(offset => {
        const idx = String(startIdx + offset).padStart(2, '0');
        return fs.existsSync(path.join(OUTPUT_DIR, `${baseLesson}_${idx}.webp`));
    });

    if (allExist) {
        console.log(`  ⏭  ${gridId} — 4 张 webp 均已存在，跳过`);
        return { id: gridId, status: 'skipped' };
    }

    // 构建 2×2 grid prompt
    const gridPrompt = `A 2x2 grid layout containing exactly 4 distinct scenes, separated by clear dividing lines. ` +
        `Top-Left: ${prompts[0]}. ` +
        `Top-Right: ${prompts[1]}. ` +
        `Bottom-Left: ${prompts[2]}. ` +
        `Bottom-Right: ${prompts[3]}` +
        STYLE;

    console.log(`  → 生成 ${gridId} (${prompts.length} panels)...`);

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${API_KEY}` },
            body: JSON.stringify({ model: MODEL, prompt: gridPrompt, n: 1, size: SIZE }),
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(`API ${res.status}: ${errText.slice(0, 200)}`);
        }

        const json = await res.json();
        const imageUrl = json.data?.[0]?.url;
        if (!imageUrl) throw new Error('No image URL in response');

        const imgRes = await fetch(imageUrl);
        const buffer = Buffer.from(await imgRes.arrayBuffer());
        fs.writeFileSync(gridPath, buffer);
        console.log(`  ✅ ${gridId} → grid saved (${(buffer.length / 1024).toFixed(0)}KB)`);

        // 裁切为 4 张
        await splitGrid(gridPath, baseLesson, gridNum);

        return { id: gridId, status: 'ok' };
    } catch (err) {
        console.error(`  ❌ ${gridId} 失败: ${err.message}`);
        return { id: gridId, status: 'error', error: err.message };
    }
}

async function splitGrid(gridPath, baseLesson, gridNum) {
    const img = sharp(gridPath);
    const meta = await img.metadata();
    const w = meta.width;
    const h = meta.height;
    const halfW = Math.floor(w / 2);
    const halfH = Math.floor(h / 2);

    const positions = [
        { left: 0, top: 0, width: halfW, height: halfH }, // TL
        { left: halfW, top: 0, width: w - halfW, height: halfH }, // TR
        { left: 0, top: halfH, width: halfW, height: h - halfH }, // BL
        { left: halfW, top: halfH, width: w - halfW, height: h - halfH }, // BR
    ];

    const startIdx = (gridNum - 1) * 4 + 1;

    for (let i = 0; i < 4; i++) {
        const idx = String(startIdx + i).padStart(2, '0');
        const outPath = path.join(OUTPUT_DIR, `${baseLesson}_${idx}.webp`);

        await sharp(gridPath)
            .extract(positions[i])
            .webp({ quality: 85 })
            .toFile(outPath);

        const size = fs.statSync(outPath).size;
        console.log(`    ✂️  ${baseLesson}_${idx}.webp (${(size / 1024).toFixed(0)}KB)`);
    }
}

// ━━━ 主流程 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const lessonArgIdx = args.indexOf('--lesson');
    const lessonFilter = lessonArgIdx >= 0 ? parseInt(args[lessonArgIdx + 1]) : null;

    // 收集所有待生成的 grids
    let allGrids = [];
    for (const [lessonNum, lesson] of Object.entries(LESSONS)) {
        if (lessonFilter && parseInt(lessonNum) !== lessonFilter) continue;
        for (const grid of lesson.grids) {
            allGrids.push({ lessonNum, lessonTitle: lesson.title, ...grid });
        }
    }

    console.log(`\n╔══════════════════════════════════════════════════╗`);
    console.log(`║   4-in-1 批量图片生成器 — L5-L20                ║`);
    console.log(`╠══════════════════════════════════════════════════╣`);
    console.log(`║ 总 Grid 数:  ${String(allGrids.length).padEnd(5)} (每 grid = 4 张图)         ║`);
    console.log(`║ 总图片数:    ${String(allGrids.length * 4).padEnd(5)} 张                       ║`);
    console.log(`║ API 调用:    ${String(allGrids.length).padEnd(5)} 次 (省 75%)              ║`);
    console.log(`║ 并发:        ${CONCURRENCY}                                  ║`);
    if (dryRun) console.log(`║ 🏳️  DRY RUN MODE                                 ║`);
    console.log(`╚══════════════════════════════════════════════════╝\n`);

    if (dryRun) {
        for (const g of allGrids) {
            console.log(`  📋 L${g.lessonNum} ${g.lessonTitle} → ${g.id}`);
            g.prompts.forEach((p, i) => console.log(`      ${['TL', 'TR', 'BL', 'BR'][i]}: ${p.slice(0, 60)}...`));
        }
        console.log(`\n📊 Dry run 完毕。共 ${allGrids.length} grids, ${allGrids.length * 4} 张图片待生成。`);
        return;
    }

    let ok = 0, skipped = 0, failed = 0;

    for (let i = 0; i < allGrids.length; i += CONCURRENCY) {
        const batch = allGrids.slice(i, i + CONCURRENCY);
        const batchNum = Math.floor(i / CONCURRENCY) + 1;
        const totalBatches = Math.ceil(allGrids.length / CONCURRENCY);

        console.log(`\n━━━ Batch ${batchNum}/${totalBatches} ━━━`);

        const results = await Promise.all(
            batch.map(g => generateGridImage(g.id, g.prompts))
        );

        for (const r of results) {
            if (r.status === 'ok') ok++;
            else if (r.status === 'skipped') skipped++;
            else failed++;
        }

        if (i + CONCURRENCY < allGrids.length) {
            console.log(`  ⏳ 等待 ${BATCH_DELAY}ms...`);
            await new Promise(r => setTimeout(r, BATCH_DELAY));
        }
    }

    console.log(`\n╔══════════════════════════════════════════════════╗`);
    console.log(`║ 📊 完成！                                        ║`);
    console.log(`║ 成功: ${String(ok).padEnd(4)} | 跳过: ${String(skipped).padEnd(4)} | 失败: ${String(failed).padEnd(4)}       ║`);
    console.log(`║ 新增图片: ${String(ok * 4).padEnd(4)} 张                             ║`);
    console.log(`╚══════════════════════════════════════════════════╝\n`);
}

main();
