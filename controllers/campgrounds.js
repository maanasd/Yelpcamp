const Campground = require('../models/campground');

module.exports.index = async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
};

module.exports.renderNewForm = (req,res) => {
    res.render('campgrounds/new');
};

module.exports.createCampground = async (req,res,next) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'successfully made a new campground!')
    res.redirect(`campgrounds/${campground.id}`)
};

module.exports.showCampground = async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate({
        path: 'reviews',
        populate:{
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    if(!campground){
        req.flash('error', 'Cannot find campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground} )
};

module.exports.renderEditForm = async (req,res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find campground')
        res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground} )
};

module.exports.updateCampground = async (req,res) =>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    req.flash('success', 'successfully updated a campground!')
    res.redirect(`/campgrounds/${campground.id}`)
};

module.exports.deleteCampground = async (req,res) =>{
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground')
    res.redirect(`/campgrounds`)
};