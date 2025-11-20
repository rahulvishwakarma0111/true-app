import React from 'react'

const TabMenu = () => {


    const data = [
        {
            id: 1,
            title: 'Mobile Packages',
            image: 'https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/bltd0d5c0951c3190f2/685b71114f190608a40a4154/icon_package_(1).svg?auto=webp',
        },
        {
            id: 2,
            title: 'Fibre Packages',
            image: 'https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/bltb01a10cd12c89524/685b7111e789892b70435646/icon_true-online.svg?auto=webp',
        },
        {
            id: 3,
            title: 'Phones & Gadgets',
            image: 'https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/blt24ce668378eb12cb/685b71112e147f396c77eff0/icon_mobile-accessories.svg?auto=webp',
        },
        {
            id: 4,
            title: 'Entertainment Packages',
            image: 'https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/blt821e580e5e708a43/685b71113d95db26c8ac0eeb/icon_entertainment.svg?auto=webp',
        },
        {
            id: 5,
            title: 'Lifestyle',
            image: 'https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/blt33b9da444f29b2c2/685b7111013b0868f753b6ea/icon_lifestyle.svg?auto=webp',
        },
        {
            id: 6,
            title: 'Smart Living',
            image: 'https://images.contentstack.io/v3/assets/blt8ba403bee4433fd8/blta23b770e764ba2b9/685b71112e147f61c177eff2/icon_smart-living.svg?auto=webp',
        },
    ]


    return (
        <div className="tab-menu-main-div">
            <div className="tab-menu-inner-area">
                {data.map((item) => (
                    <div key={item.id} className="tab-menu-item">
                        <img src={item.image} alt={item.title} className="tab-menu-image" />
                        <span className="tab-menu-title">{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default TabMenu